const aiClient = require('../../lib/aiClient');

/**
 * Service to handle chat-based cooking assistant logic
 */
const getChatResponse = async (message, history = []) => {
    try {
        const systemPrompt = `
            You are a friendly, expert AI kitchen assistant named "Food AI Kitchen".
            You help users with everything related to cooking, food, and meal planning.
            
            RULES:
            1. Keep responses helpful, encouraging, and focused on food.
            2. If someone asks for a recipe, give a concise summary or suggest they use the "Ingredient AI" module for detailed formatting.
            3. For cost estimation, be realistic for the Indian market (₹ / INR).
            4. Keep the tone warm and professional.
            5. IMPORTANT: When suggesting recipe ideas, ALWAYS use simple, easy, and short titles (2-4 words). Add an emoji. 
               Format like: "Easy + Ingredient + Dish" (e.g. "Easy Egg Toast 🍞", "Quick Bread Snack 🥪", "Simple Samayal 🍛", "Let’s Make Egg Toast 🍳").
        `;

        // Format history for context if provided (for now, just simple user message)
        let contextMessage = message;
        if (history.length > 0) {
            contextMessage = `User Message: ${message}\nChat History: ${JSON.stringify(history)}`;
        }

        // Call AI client
        const response = await aiClient.callAI(systemPrompt, contextMessage, false);
        return response;

    } catch (error) {
        console.error("Chat Service Error:", error);
        return "Sorry, I'm having a bit of trouble in the kitchen right now. Ask me again in a moment! 🍳";
    }
};

module.exports = {
    getChatResponse
};
