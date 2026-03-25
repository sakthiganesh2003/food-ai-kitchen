const express = require('express');
const router = express.Router();
const controller = require('./controller');

/**
 * Route: POST /ai/ingredients
 * Purpose: Takes ingredients and preferences, returns a generated recipe from AI.
 */
router.post('/ingredients', controller.postIngredientAI);
router.post('/titles', controller.postTitles);
router.post('/recipe', controller.postDetailedRecipe);

module.exports = router;
