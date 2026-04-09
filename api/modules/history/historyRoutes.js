const express = require('express');
const router = express.Router();
const { getUserHistory, saveHistory } = require('./historyController');
const { verifyToken } = require('../auth/authMiddleware');

router.use(verifyToken); // Protect all history routes

router.get('/', getUserHistory);
router.post('/', saveHistory);

module.exports = router;
