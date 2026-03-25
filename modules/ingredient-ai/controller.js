const ingredientAIService = require('./service');

/**
 * Controller class to handle Express requests and call services
 */
const postIngredientAI = async (req, res) => {
    try {
        const { ingredients, preferences } = req.body;

        // Validation for input:
        if (!ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ error: "No ingredients provided or invalid format." });
        }

        // Call the service with ingredients and preferences
        const result = await ingredientAIService.processIngredientAI(ingredients, preferences || {});

        // Return a successful response
        res.status(200).json({
            success: true,
            message: "Recipe generated successfully from ingredients.",
            data: result
        });

    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({
            success: false,
            message: "An internal error occurred while processing the ingredients.",
            error: error.message
        });
    }
};

const postTitles = async (req, res) => {
    try {
        const { ingredients, preferences } = req.body;
        if (!ingredients || !Array.isArray(ingredients)) return res.status(400).json({ error: "Invalid ingredients." });
        
        const result = await ingredientAIService.processTitles(ingredients, preferences || {});
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const postDetailedRecipe = async (req, res) => {
    try {
        const { ingredients, title, preferences } = req.body;
        if (!ingredients || !title) return res.status(400).json({ error: "Missing required fields." });
        
        const result = await ingredientAIService.processDetailedRecipe(ingredients, title, preferences || {});
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    postIngredientAI,
    postTitles,
    postDetailedRecipe
};
