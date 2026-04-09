const { db } = require('../../lib/firebase');

/**
 * Controller class to handle History and saved AI recipes
 */

const getUserHistory = async (req, res) => {
    try {
        const uid = req.user.uid;

        if (!db) {
            // Mock History
            return res.status(200).json({
                success: true,
                data: [
                    { id: "1", type: "recipe", title: "Spicy Tomato Skillet", timestamp: new Date().toISOString() },
                    { id: "2", type: "chat", title: "Chat about Vegan substitutes", timestamp: new Date().toISOString() }
                ]
            });
        }

        // Instead of where + orderBy (which requires a composite index in Firebase)
        // We will fetch by where('uid') and sort locally in JS.
        const historySnapshot = await db.collection('user_history')
            .where('uid', '==', uid)
            .get();

        const history = historySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 50);

        res.status(200).json({ success: true, data: history });

    } catch (error) {
        if (error.code === 7 || error.code === 9 || String(error).includes('Firestore API') || String(error).includes('requires an index')) {
            return res.status(200).json({
                success: true,
                data: [
                    { id: "mock_1", type: "recipe", title: "Spicy Tomato Skillet (Mock Fallback)", timestamp: new Date().toISOString() },
                    { id: "mock_2", type: "chat", title: "Chat about Vegan substitutes (Mock Fallback)", timestamp: new Date().toISOString() }
                ]
            });
        }
        console.error("Get History Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const saveHistory = async (req, res) => {
    try {
        const uid = req.user.uid;
        const { type, content, title } = req.body; // type: 'recipe' | 'chat'

        if (!db) {
           return res.status(200).json({ success: true, message: "History saved (MOCK)" });
        }

        await db.collection('user_history').add({
            uid,
            type,
            title: title || "New Generation",
            content,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ success: true, message: "Successfully saved to history" });

    } catch (error) {
        if (error.code === 7 || String(error).includes('Firestore API')) {
            return res.status(200).json({ success: true, message: "History saved (MOCK DB)" });
        }
        console.error("Save History Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getUserHistory,
    saveHistory
};
