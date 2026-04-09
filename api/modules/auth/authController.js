const { db } = require('../../lib/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_chefmind';

const registerUser = async (req, res) => {
    try {
        const { email, password, displayName } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Missing required fields" });

        if (!db) return res.status(200).json({ success: true, token: "mock_token_" + email });

        const snapshot = await db.collection('users').where('email', '==', email).get();
        if (!snapshot.empty) return res.status(400).json({ error: "Email already in use" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUserRef = db.collection('users').doc();
        const userData = {
            uid: newUserRef.id,
            email,
            password: hashedPassword,
            displayName: displayName || email.split('@')[0],
            role: 'user',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        await newUserRef.set(userData);

        const token = jwt.sign({ uid: userData.uid, email: userData.email, role: userData.role }, JWT_SECRET, { expiresIn: '7d' });
        
        // Remove password from response
        delete userData.password;
        res.status(201).json({ success: true, message: "User created", token, user: userData });
    } catch (error) {
        if (error.code === 7 || String(error).includes('Firestore API')) {
            console.warn("⚠️ Firestore API is disabled. Falling back to Mock Registration for UI testing.");
            const token = jwt.sign({ uid: "mock_u_" + req.body.email, email: req.body.email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
            return res.status(201).json({ success: true, message: "User created (MOCK DB)", token, user: { email: req.body.email, role: 'user' } });
        }
        console.error("Register Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Missing credentials" });

        if (!db) return res.status(200).json({ success: true, token: "mock_token_123" });

        const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
        if (snapshot.empty) return res.status(400).json({ error: "Invalid credentials" });

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();

        // Check password (only if it exists, some may be legacy Firebase logged in users)
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
        }

        await userDoc.ref.update({ lastLogin: new Date().toISOString() });

        const token = jwt.sign({ uid: user.uid || userDoc.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        
        delete user.password;
        res.status(200).json({ success: true, token, user });
    } catch (error) {
        if (error.code === 7 || String(error).includes('Firestore API')) {
            console.warn("⚠️ Firestore API is disabled. Falling back to Mock Login for UI testing.");
            const token = jwt.sign({ uid: "mock_u_" + req.body.email, email: req.body.email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
            return res.status(200).json({ success: true, message: "User logged in (MOCK DB)", token, user: { email: req.body.email, role: 'admin' } });
        }
        console.error("Login Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};
