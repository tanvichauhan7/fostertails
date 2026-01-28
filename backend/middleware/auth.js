import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - check if user is logged in
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in cookies
        if (req.cookies.token) {
            token = req.cookies.token;
        }

        // Check if no token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please login.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database (exclude password)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        next(); // Continue to next middleware/route
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed'
        });
    }
};

// Admin only middleware
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin only.'
        });
    }
};

// NGO only middleware
export const ngoOnly = (req, res, next) => {
    if (req.user && req.user.role === 'ngo') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. NGO accounts only.'
        });
    }
};

// Admin or NGO middleware
export const adminOrNGO = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'ngo')) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin or NGO accounts only.'
        });
    }
};