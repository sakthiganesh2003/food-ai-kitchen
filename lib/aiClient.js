const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize OpenAI client (if key exists)
const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here' 
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
    : null;

// Initialize Gemini client (if key exists)
const genAI = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'gen-lang-client-example' 
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

/**
 * Helper to clean and parse JSON from AI strings
 */
const safeParseJson = (text) => {
    try {
        // Remove markdown blocks
        let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        // Find the first JSON boundary
        const firstBrace = clean.indexOf('{');
        const firstBracket = clean.indexOf('[');
        const lastBrace = clean.lastIndexOf('}');
        const lastBracket = clean.lastIndexOf(']');
        
        let start = -1;
        let end = -1;

        if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
            start = firstBrace;
            end = lastBrace;
        } else if (firstBracket !== -1) {
            start = firstBracket;
            end = lastBracket;
        }

        if (start !== -1 && end !== -1) {
            clean = clean.substring(start, end + 1);
        }
        
        return JSON.parse(clean);
    } catch (e) {
        console.error("Failed to parse JSON text:", text);
        throw new Error("Invalid response format from AI.");
    }
};

/**
 * Core function to call AI with a generic system/user prompt
 */
const callAI = async (systemPrompt, userPrompt, isJson = false) => {
    const hasOpenAI = !!openai;
    const hasGemini = !!genAI;

    if (!hasOpenAI && !hasGemini) {
        console.warn("⚠️ NO AI API KEY found.");
        return isJson ? { response: "Mock JSON Response" } : "Mock AI Response";
    }

    if (hasOpenAI) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                response_format: isJson ? { type: "json_object" } : undefined
            });
            const content = response.choices[0].message.content;
            return isJson ? safeParseJson(content) : content;
        } catch (error) {
            console.error("OpenAI Error:", error);
            if (!hasGemini) throw error;
            console.log("Falling back to Gemini...");
        }
    }

    if (hasGemini) {
        try {
            // Using the recommended genAI model configuration for better reliability
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash",
                systemInstruction: systemPrompt 
            });
            const prompt = `${userPrompt}\n\n${isJson ? 'ONLY JSON RESULT.' : ''}`;
            
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            
            return isJson ? safeParseJson(text) : text;
        } catch (error) {
            if (error.status === 429 || String(error.message).includes('429')) {
                console.warn(`[GEMINI API WARNING]: Rate Limit / Quota Exceeded (429). The system will now use fallback mock generation.`);
            } else {
                console.error("[GEMINI API ERROR]:", error.message || "Unknown error");
            }
            throw error;
        }
    }
};

module.exports = {
    callAI
};
