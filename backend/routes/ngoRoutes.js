import express from 'express';
import {
    createNGO,
    getAllNGOs,
    getNGOById,
    updateNGO,
    addReview,
    getVerifiedNGOs,
    verifyNGO
} from '../controllers/ngoController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllNGOs);
router.get('/verified', getVerifiedNGOs);
router.get('/:id', getNGOById);

// Protected routes
router.post('/', protect, createNGO);
router.put('/:id', protect, updateNGO);
router.post('/:id/review', protect, addReview);

// Admin only
router.put('/:id/verify', protect, admin, verifyNGO);

export default router;