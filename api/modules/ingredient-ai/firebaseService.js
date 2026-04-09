const admin = require('firebase-admin');
require('dotenv').config();

/**
 * Service for Firebase integration – handles saving and history.
 */
let db;

try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    
    if (serviceAccountPath) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
        console.log("🔥 Firebase Admin initialized successfully!");
    } else {
        console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_PATH not found in .env. Save features disabled.");
    }
} catch (error) {
    console.error("❌ Firebase Initialization Error:", error);
}

const saveRecipe = async (userId, recipeData) => {
    if (!db) return null;
    try {
        const docRef = await db.collection('user_recipes').add({
            userId,
            ...recipeData,
            savedAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (error) {
        console.error("Firebase Save Error:", error);
        throw error;
    }
};

const getHistory = async (userId) => {
    if (!db) return [];
    try {
        const snapshot = await db.collection('user_recipes')
            .where('userId', '==', userId)
            .orderBy('savedAt', 'desc')
            .limit(10)
            .get();
            
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Firebase Fetch Error:", error);
        throw error;
    }
};

module.exports = {
    saveRecipe,
    getHistory
};
