const bookingService = require('./bookingService');

/**
 * Controller class to handle "Book Cook" requests
 */
const postBooking = async (req, res) => {
    try {
        const { userId, date, timeSlots, totalMembers, dietaryNotes, location } = req.body;

        const result = await bookingService.createBooking({
            userId, date, timeSlots, totalMembers, dietaryNotes, location
        });

        res.status(201).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Booking Controller Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal error creating booking.",
            error: error.message
        });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await bookingService.getBookingsByUser(userId);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Get Bookings Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal error fetching bookings.",
            error: error.message
        });
    }
};

module.exports = {
    postBooking,
    getMyBookings
};
