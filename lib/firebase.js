const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Attempt to load the service account
try {
    const serviceAccountPath = path.resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'chatbotai-firebase-adminsdk.json');
    const serviceAccount = require(serviceAccountPath);

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ Firebase Admin Initialized Successfully");
    }
} catch (error) {
    console.warn("⚠️ Firebase Admin Initialization Warning:", error.message);
    console.warn("Continuing without Firebase DB/Auth functionality. Make sure the service account JSON is present.");
}

const db = admin.apps.length ? admin.firestore() : null;
const auth = admin.apps.length ? admin.auth() : null;

module.exports = {
    admin,
    db,
    auth
};
