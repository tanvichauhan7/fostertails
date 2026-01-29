import express from 'express';
import {
    createDonation,
    verifyPayment,
    getAllDonations,
    getMyDonations,
    getNGODonations,
    getDonationById
} from '../controllers/donationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/', protect, createDonation);
router.post('/verify', protect, verifyPayment);
router.get('/my/donated', protect, getMyDonations);
router.get('/ngo/received', protect, getNGODonations);
router.get('/:id', protect, getDonationById);

// Admin only
router.get('/', protect, admin, getAllDonations);

export default router;