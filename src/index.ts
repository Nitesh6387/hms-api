import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import dotenv from 'dotenv';
import expressFileUpload from 'express-fileupload';
import { route } from './routes/router';
import { AppDataSource } from './DbConfig';
import path from 'path';
import { envConfig } from './config/env.config';
import { securityHeaders, corsMiddleware } from './middleware/security';
import logger from './config/logger';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();

// Initialize database
AppDataSource.initialize()
  .then(() => {
    logger.info('Database connection established successfully');
  })
  .catch((err: any) => {
    logger.error('Database connection failed:', err);
    process.exit(1);
  });

// Security middleware
app.use(securityHeaders);
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload middleware with validation
app.use(expressFileUpload({
  limits: {
    fileSize: envConfig.upload.maxFileSize,
  },
  abortOnLimit: true,
  useTempFiles: true,
  tempFileDir: path.join(__dirname, '../uploads/temp'),
  createParentPath: true,
}));

// Static files
app.use('/static', express.static(path.join(__dirname, '../uploads')));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Routes
app.use('/v1/api', route);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: envConfig.server.env,
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: true,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = envConfig.server.port;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT} in ${envConfig.server.env} mode`);
  console.log(`Server is running on the port: ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;