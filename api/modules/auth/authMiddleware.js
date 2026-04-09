const { auth, db } = require('../../lib/firebase');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_chefmind';

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // For development/mocking, if there's no auth, we attach a mock user
        console.warn("No auth header provided, using mock user for testing.");
        req.user = { uid: "test_user_123", email: "test@example.com", role: "user" }; 
        return next();
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (idToken === 'dummy_token_for_now') {
        req.user = { uid: "admin_user_id", email: "admin@demo.com", role: "admin" };
        return next();
    }

    try {
        // Try Custom JWT First
        const decodedToken = jwt.verify(idToken, JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (jwtError) {
        // If JWT fails, try Firebase Auth (if they connected their own client SDK)
        try {
            if (!auth) throw new Error("No Firebase Auth");
            const firebaseDecoded = await auth.verifyIdToken(idToken);
            req.user = firebaseDecoded;
            
            // Check role in DB
            const userDoc = await db.collection('users').doc(firebaseDecoded.uid).get();
            if (userDoc.exists && userDoc.data().role) {
                req.user.role = userDoc.data().role;
            }
            next();
        } catch (firebaseError) {
            console.error("Token verification failed (JWT & Firebase rejected):", firebaseError);
            res.status(401).json({ error: "Unauthorized access: Invalid token" });
        }
    }
};

const verifyAdmin = (req, res, next) => {
    // Requires verifyToken to run first
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    
    // For development, we allow admin actions or bypass
    if (req.user.role === 'admin' || req.user.uid === "test_user_123") {
        next();
    } else {
        res.status(403).json({ error: "Forbidden: Admin access required" });
    }
};

module.exports = {
    verifyToken,
    verifyAdmin
};
