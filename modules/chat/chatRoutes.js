const express = require('express');
const router = express.Router();
const controller = require('./chatController');

/**
 * Route: POST /api/chat/ask
 * Purpose: Chat with GPT-4 Assistant about anything food-related.
 */
router.post('/ask', controller.postChat);

module.exports = router;
