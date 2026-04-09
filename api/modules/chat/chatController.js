const chatService = require('./chatService');

/**
 * Controller class to handle Chat requests
 */
const postChat = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        const response = await chatService.getChatResponse(message, history || []);

        res.status(200).json({
            success: true,
            data: {
                reply: response
            }
        });

    } catch (error) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal error while processing chat.",
            error: error.message
        });
    }
};

module.exports = {
    postChat
};
