const aiService = require('./aiService');

/**
 * Higher-level service that coordinates AI processing and response generation
 */
const processIngredientAI = async (ingredients, preferences) => {
    // 1. Basic validation
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        throw new Error("No ingredients provided.");
    }

    try {
        // 2. Core AI processing
        const recipe = await aiService.generateRecipe(ingredients, preferences);

        // 3. Optional: Add extra ingredients if needed (Rule: If basic essentials like salt/oil/water aren't in provided, assume them)
        // (For MVP, we trust the AI response's handling)

        // 4. Transform AI result into standard internal format
        const responseData = {
            recipes: (recipe.recipes || []).map(r => ({
                id: Date.now().toString() + Math.random().toString(36).substring(7),
                recipeName: r.recipeName || "Unknown Recipe",
                difficulty: r.difficulty || "Medium",
                prepTime: r.prepTime || "10 mins",
                cookTime: r.cookTime || "20 mins",
                servings: r.servings || 2,
                calories: r.calories || "N/A",
                ingredients: r.ingredients || [],
                instructions: r.instructions || [],
                chefTips: r.chefTips || "Enjoy your meal!",
                tags: r.tags || [],
                isMock: r.isMock || false
            })),
            isAI: true,
            timestamp: new Date().toISOString()
        };

        return responseData;

    } catch (error) {
        // Fallback to matcher logic if AI fails (Matcher.js will be used here later)
        console.error("AI processing failed, falling back to basic matching logic...");
        // For now, rethrow or return custom error
        throw error;
    }
};

const processTitles = async (ingredients, preferences) => {
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        throw new Error("No ingredients provided.");
    }
    const result = await aiService.generateTitles(ingredients, preferences);
    return result;
};

const processDetailedRecipe = async (ingredients, title, preferences) => {
    if (!ingredients || !title) throw new Error("Missing inputs");
    const result = await aiService.generateDetailedRecipe(ingredients, title, preferences);
    
    // Normalize format
    const responseData = {
        recipes: (result.recipes || []).map(r => ({
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            recipeName: r.recipeName || title,
            difficulty: r.difficulty || "Medium",
            prepTime: r.prepTime || "10 mins",
            cookTime: r.cookTime || "20 mins",
            servings: r.servings || 2,
            calories: r.calories || "N/A",
            ingredients: r.ingredients || [],
            instructions: r.instructions || [],
            chefTips: r.chefTips || "Enjoy your meal!",
            tags: r.tags || [],
            isMock: r.isMock || false
        })),
        isAI: true,
        timestamp: new Date().toISOString()
    };
    return responseData;
};

module.exports = {
    processIngredientAI,
    processTitles,
    processDetailedRecipe
};
