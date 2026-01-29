import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authroutes.js';
import petRoutes from './routes/petRoutes.js';
import ngoRoutes from './routes/ngoRoutes.js';
import donationRoutes from './routes/donationRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());

// Welcome route
app.get('/', (req, res) => {
    res.json({ 
        message: '🐾 Welcome to FosterTails API!',
        description: 'Connecting stray pets with loving foster homes and adopters',
        status: 'success',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            pets: '/api/pets',
            ngos: '/api/ngos',
            donations: '/api/donations'
        }
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
    });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/donations', donationRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ FosterTails Server is running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});