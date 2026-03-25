const express = require('express');
const router = express.Router();
const { getAllUsers, getAllHistory, getAllBookings } = require('./adminController');
const { verifyToken, verifyAdmin } = require('../auth/authMiddleware');

// Protect admin routes with both Token Verification and Admin Role check
router.use(verifyToken);
router.use(verifyAdmin);

router.get('/users', getAllUsers);
router.get('/history', getAllHistory); // Can view past recipes and chat logs
router.get('/bookings', getAllBookings);

module.exports = router;
