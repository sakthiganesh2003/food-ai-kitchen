const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware — Allow Vercel frontend + local dev
const allowedOrigins = [
    'http://localhost:3000',
    'https://food-ai-kitchen-git-main-sakthiganesh8098-8836s-projects.vercel.app',
    /\.vercel\.app$/  // allow all vercel preview deployments
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.some(o =>
                typeof o === 'string' ? o === origin : o.test(origin)
            )
        ) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
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

// Export the app for Vercel
module.exports = app;

// Listen only if running directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`\n================================`);
        console.log(`🚀 Bot is running at: http://localhost:${PORT}`);
        console.log(`📁 Modules loaded: /modules/ingredient-ai/routes`);
        console.log(`🛠️ Health check: http://localhost:${PORT}/health`);
        console.log(`📥 API endpoint: POST http://localhost:${PORT}/api/ai/ingredients`);
        console.log(`================================\n`);
    });
}

