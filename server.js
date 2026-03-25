const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const ingredientAIRoutes = require('./modules/ingredient-ai/routes');
const chatRoutes = require('./modules/chat/chatRoutes');
const bookingRoutes = require('./modules/booking/bookingRoutes');
const authRoutes = require('./modules/auth/authRoutes');
const historyRoutes = require('./modules/history/historyRoutes');
const adminRoutes = require('./modules/admin/adminRoutes');

/**
 * Main API entry points
 */
app.use('/api/ai', ingredientAIRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: "ok", message: "Food AI Kitchen Server Running" });
});

// Root route
app.get('/', (req, res) => {
    res.send("<h1>🤖 Ingredient AI - Backend API</h1><p>Running on PORT: " + PORT + "</p>");
});

// 404 Error handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
    console.log(`\n================================`);
    console.log(`🚀 Bot is running at: http://localhost:${PORT}`);
    console.log(`📁 Modules loaded: /modules/ingredient-ai/routes`);
    console.log(`🛠️ Health check: http://localhost:${PORT}/health`);
    console.log(`📥 API endpoint: POST http://localhost:${PORT}/api/ai/ingredients`);
    console.log(`================================\n`);
});
