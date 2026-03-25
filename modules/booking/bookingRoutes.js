const express = require('express');
const router = express.Router();
const controller = require('./bookingController');

/**
 * Route: POST /api/booking/create
 * Purpose: Request a cook for a specific date/time.
 */
router.post('/create', controller.postBooking);

/**
 * Route: GET /api/booking/my-bookings/:userId
 * Purpose: Fetch a user's booking history.
 */
router.get('/my-bookings/:userId', controller.getMyBookings);

module.exports = router;
