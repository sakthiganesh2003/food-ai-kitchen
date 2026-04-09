const aiClient = require('../../lib/aiClient');

/**
 * Service to generate recipes using unified AI client
 */
const generateRecipe = async (ingredients, preferences = {}) => {
    try {
        const promptSnippet = buildPrompt(ingredients, preferences);
        const systemPrompt = getSystemMessage(preferences.language || 'English');
        const userPrompt = `Generate 5 distinct high-quality recipes in the prescribed JSON format in ${preferences.language || 'English'} language for: ${promptSnippet}`;

        // Call the unified AI with JSON mode
        const response = await aiClient.callAI(systemPrompt, userPrompt, true);
        
        // 🛡️ Guard: Sometimes AI wraps the response in a "recipes" key, or returns an array directly
        if (Array.isArray(response)) {
            return { recipes: response };
        }
        if (response.recipes && Array.isArray(response.recipes)) {
            return response;
        }

        // Fallback if AI didn't follow schema perfectly but returned a single recipe
        if (response.recipeName) {
             return { recipes: [response] };
        }

        return response;
    } catch (error) {
        console.error("AI Generation Error: " + error.message);
        return getMockRecipe(ingredients); // Fallback to mock on error
    }
};

/**
 * Helper: Build Prompt based on preferences
 */
const buildPrompt = (ingredients, preferences) => {
    const { spicy, healthy, dietary, maxTime, budget, language } = preferences;
    let snippet = `Ingredients available: ${ingredients.join(', ')}.`;
    if (spicy) snippet += ` Make it spicy and flavorful.`;
    if (healthy) snippet += ` Focus on low calorie and highly nutritious options.`;
    if (dietary) snippet += ` Strict diet adherence: ${dietary}.`;
    if (maxTime) snippet += ` Must be ready in under ${maxTime} minutes.`;
    if (budget) snippet += ` Keep ingredient costs around ₹${budget}.`;
    return snippet;
};

/**
 * Helper: Master System Message
 */
const getSystemMessage = (language) => `
    You are a Michelin-star AI chef with expertise in Indian and global street foods.
    Your task is to provide 5 distinct, creative recipes based ONLY on provided ingredients (plus basic staples like oil, salt, water).
    
    IMPORTANT TITLE INSTRUCTION: 
    Keep recipeName strictly SHORT (2-4 words). Use easy English and clear meaning. 
    Use the format: "[Adjective] + [Ingredient] + [Dish]". 
    Examples: "Easy Egg Toast", "Quick Bread Snack", "Simple Onion Curry".

    IMPORTANT TRANSLATION INSTRUCTION:
    All textual content in your response (recipeName, difficulty, prepTime, cookTime, ingredients.item, instructions, chefTips, tags) MUST be translated into ${language}. The JSON keys MUST remain in English.

    STRICT JSON SCHEMA:
    {
        "recipes": [
            {
                "recipeName": "String (e.g. Easy Egg Toast)",
                "difficulty": "Easy/Medium/Hard",
                "prepTime": "e.g. 10m",
                "cookTime": "e.g. 20m",
                "servings": 2,
                "calories": "e.g. 450 kcal",
                "ingredients": [
                    { "item": "Ingredient Name in ${language}", "amount": "Quantity" }
                ],
                "instructions": [
                    "Clear step by step instructions (Step 1 in ${language})",
                    "Clear step by step instructions (Step 2 in ${language})"
                ],
                "chefTips": "Pro secret to making it restaurant quality in ${language}",
                "tags": ["Healthy", "Spicy", "Quick"]
            }
        ]
    }

    IMPORTANT: Return ONLY the JSON object. Do not explain anything outside the JSON.
`;

/**
 * Mock recipe generator when API fails
 */
const getMockRecipe = (ingredients) => {
    return {
        recipes: [
            {
                isMock: true,
                recipeName: `Spicy Tomato & Egg Skillet`,
                difficulty: "Easy",
                prepTime: "10m",
                cookTime: "15m",
                servings: 2,
                calories: "340 kcal",
                ingredients: [
                    { item: ingredients[0] || "Eggs", amount: "2 large" },
                    { item: ingredients[1] || "Tomato", amount: "2 chopped" },
                    { item: "Onion", amount: "1/2 diced" },
                    { item: "Olive Oil", amount: "1 tbsp" }
                ],
                instructions: [
                    "Heat olive oil in a skillet over medium heat.",
                    "Add the diced onions and cook until translucent.",
                    "Mix in the chopped tomatoes, cover, and let simmer until it forms a thick sauce.",
                    "Create small wells in the sauce and crack the eggs into them.",
                    "Cover the skillet and cook for 5 minutes until the eggs are set.",
                    "Garnish with herbs and serve hot with crusty bread!"
                ],
                chefTips: "For an extra kick, sprinkle some red chili flakes over the eggs before covering the pan.",
                tags: ["Healthy", "High Protein", "Quick"]
            },
            {
                isMock: true,
                recipeName: `Quick Stir Fry`,
                difficulty: "Medium",
                prepTime: "10m",
                cookTime: "10m",
                servings: 2,
                calories: "250 kcal",
                ingredients: [
                    { item: ingredients[0] || "Vegetables", amount: "2 cups" },
                    { item: "Soy Sauce", amount: "2 tbsp" },
                    { item: "Garlic", amount: "2 cloves minced" }
                ],
                instructions: [
                    "Heat a wok or large pan until smoking hot.",
                    "Add oil and quickly stir-fry the aromatics.",
                    "Toss in the main ingredients and sear.",
                    "Add the sauce and toss to coat evenly.",
                    "Serve immediately while hot!"
                ],
                chefTips: "Keep the vegetables crisp by cooking them extremely fast on high heat.",
                tags: ["Quick", "Vegan", "Easy"]
            }
        ]
    };
};

/**
 * Generate just recipe titles based on ingredients
 */
const generateTitles = async (ingredients, preferences = {}) => {
    try {
        const promptSnippet = buildPrompt(ingredients, preferences);
        const systemPrompt = `
            You are a Michelin-star AI chef with expertise in Indian and global street foods.
            Your task is to provide 6 distinct, highly creative, and simple recipe titles based ONLY on the provided ingredients.
            
            IMPORTANT TITLE INSTRUCTION: 
            Keep recipeName strictly SHORT (2-4 words). Use easy English and clear meaning. 
            Use the format: "[Adjective] + [Ingredient] + [Dish]". 
            Examples: "Easy Egg Toast", "Quick Bread Snack", "Simple Onion Curry".

            All textual content MUST be translated into ${preferences.language || 'English'}. The JSON keys MUST remain in English.

            STRICT JSON SCHEMA:
            {
                "titles": [
                    { "title": "String (e.g. Easy Egg Toast)" },
                    { "title": "String" },
                    { "title": "String" },
                    { "title": "String" },
                    { "title": "String" },
                    { "title": "String" }
                ]
            }
        `;
        const userPrompt = `Generate 6 recipe titles in ${preferences.language || 'English'} for: ${promptSnippet}`;

        const response = await aiClient.callAI(systemPrompt, userPrompt, true);
        
        if (Array.isArray(response)) return { titles: response };
        if (response.titles && Array.isArray(response.titles)) return response;
        
        return { titles: [{ title: "Easy Tomato Skillet" }, { title: "Spicy Onion Fry" }, { title: "Quick Snack Bowl" }] };
    } catch (error) {
        console.error("AI Title Gen Error:", error);
        return { 
            titles: [
                { title: "Easy Tomato Skillet" }, 
                { title: "Spicy Onion Fry" }, 
                { title: "Quick Snack Bowl" },
                { title: "Simple Garlic Toast" },
                { title: "Classic Comfort Meal" },
                { title: "Fast Pan Roast" }
            ] 
        };
    }
};

/**
 * Generate a detailed recipe based on a selected title
 */
const generateDetailedRecipe = async (ingredients, title, preferences = {}) => {
    try {
        const promptSnippet = buildPrompt(ingredients, preferences);
        const language = preferences.language || 'English';
        const systemPrompt = `
            You are a Michelin-star AI chef.
            Generate a full recipe using ONLY the provided ingredients based on the selected title: "${title}".
            
            IMPORTANT:
            Translate all textual content to ${language}. Keys must remain in English.

            STRICT JSON SCHEMA:
            {
                "recipeName": "${title}",
                "difficulty": "Easy/Medium/Hard",
                "prepTime": "e.g. 10m",
                "cookTime": "e.g. 20m",
                "servings": 2,
                "calories": "e.g. 450 kcal",
                "ingredients": [
                    { "item": "Ingredient Name in ${language}", "amount": "Quantity" }
                ],
                "instructions": [
                    "Step 1 in ${language}",
                    "Step 2 in ${language}"
                ],
                "chefTips": "Pro secret in ${language}",
                "tags": ["Healthy", "Spicy"]
            }
        `;
        const userPrompt = `Generate the deep detailed JSON recipe for ${title}. ${promptSnippet}`;

        const response = await aiClient.callAI(systemPrompt, userPrompt, true);
        return { recipes: [response] };
    } catch (error) {
        console.error("AI Specific Recipe Error:", error);
        return getMockRecipe(ingredients);
    }
};

module.exports = {
    generateRecipe,
    generateTitles,
    generateDetailedRecipe
};
