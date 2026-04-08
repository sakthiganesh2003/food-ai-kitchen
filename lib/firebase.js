const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Attempt to load the service account
try {
    let serviceAccount;

    // 1. Check if the full JSON is provided as a string (Best for Vercel/Production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } 
    // 2. Fallback to file path
    else {
        const serviceAccountPath = path.resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'chatbotai-firebase-adminsdk.json');
        serviceAccount = require(serviceAccountPath);
    }

    if (serviceAccount && !admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ Firebase Admin Initialized Successfully");
    }
} catch (error) {
    console.warn("⚠️ Firebase Admin Initialization Warning:", error.message);
    console.warn("Continuing without Firebase DB/Auth functionality. Make sure the service account JSON/String is present.");
}


const db = admin.apps.length ? admin.firestore() : null;
const auth = admin.apps.length ? admin.auth() : null;

module.exports = {
    admin,
    db,
    auth
};
