import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Initialize Supabase first
import './config/supabase';

// Middleware
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import homeRoutes from './routes/homes';
import roomRoutes from './routes/rooms';
import itemRoutes from './routes/items';
import imageRoutes from './routes/images';
import notificationRoutes from './routes/notifications';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:19006'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/homes', homeRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Covered Backend v2.0 running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📱 Mobile access: http://192.168.5.125:${PORT}/health`);
});