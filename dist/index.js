"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// Initialize Supabase first
require("./config/supabase");
// Middleware
const errorHandler_1 = require("./middleware/errorHandler");
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const homes_1 = __importDefault(require("./routes/homes"));
const rooms_1 = __importDefault(require("./routes/rooms"));
const items_1 = __importDefault(require("./routes/items"));
const images_1 = __importDefault(require("./routes/images"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:19006'],
    credentials: true
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});
// API routes
app.use('/api/auth', auth_1.default);
app.use('/api/homes', homes_1.default);
app.use('/api/rooms', rooms_1.default);
app.use('/api/items', items_1.default);
app.use('/api/images', images_1.default);
app.use('/api/notifications', notifications_1.default);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use('*', (_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Covered Backend v2.0 running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
//# sourceMappingURL=index.js.map