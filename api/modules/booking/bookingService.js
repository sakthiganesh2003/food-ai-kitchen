const admin = require('firebase-admin');

/**
 * Service to handle "Book a Cook" logic using Firestore
 */
const createBooking = async (bookingData) => {
    try {
        const db = admin.firestore();
        const { userId, date, timeSlots, totalMembers, dietaryNotes, location } = bookingData;

        // 1. Basic Validation
        if (!userId || !date || !timeSlots || !location) {
            throw new Error("Missing required booking fields (userId, date, timeSlots, location).");
        }

        // 2. Save to Firestore
        const bookingRef = await db.collection('bookings').add({
            userId,
            date,
            timeSlots,
            totalMembers: totalMembers || 1,
            dietaryNotes: dietaryNotes || "None",
            location,
            status: 'pending', // pending, confirmed, completed, cancelled
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        return {
            id: bookingRef.id,
            status: 'pending',
            message: "Booking request received successfully."
        };

    } catch (error) {
        console.error("Booking Service Error:", error);
        throw error;
    }
};

const getBookingsByUser = async (userId) => {
    try {
        const db = admin.firestore();
        const snapshot = await db.collection('bookings')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Fetch Bookings Error:", error);
        throw error;
    }
};

module.exports = {
    createBooking,
    getBookingsByUser
};
