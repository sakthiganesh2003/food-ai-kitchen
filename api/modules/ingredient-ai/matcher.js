/**
 * Module for basic ingredient matching logic – backup for AI processing.
 * Matches input ingredients with a database (Mock here for now).
 */

const baseRecipes = [
    { name: "Bread/Egg Sandwich", ingredients: ["egg", "bread", "onion"], steps: ["Fry onion", "Fry egg", "Toast bread", "Assemble toast"] },
    { name: "Scrambled Eggs", ingredients: ["egg"], steps: ["Crack eggs in bowl", "Heat pan", "Cook and stir until set"] },
    { name: "Simple Pasta", ingredients: ["pasta", "onion", "tomato"], steps: ["Boil pasta", "Sauté onion and tomato", "Combine and serve"] }
];

const matchIngredients = (providedIngredients = []) => {
    // Basic fuzzy matching logic here
    const normalizedProvided = providedIngredients.map(i => i.toLowerCase().trim());

    // Filter recipes by ingredients matching
    const matches = baseRecipes.map(recipe => {
        let matchCount = 0;
        recipe.ingredients.forEach(ingredient => {
            if (normalizedProvided.includes(ingredient.toLowerCase())) {
                matchCount++;
            }
        });

        return { ...recipe, matchScore: matchCount / recipe.ingredients.length };
    }).filter(recipe => recipe.matchScore > 0);

    // Return the best match or first 3
    return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
};

module.exports = {
    matchIngredients
};
