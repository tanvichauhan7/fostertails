import express from 'express';
import {
    createPet,
    getAllPets,
    getPetById,
    updatePet,
    deletePet,
    submitRequest,
    updateRequestStatus,
    getMyPostedPets,
    getFeaturedPets
} from '../controllers/petController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllPets);
router.get('/featured', getFeaturedPets);
router.get('/:id', getPetById);

// Protected routes (need to be logged in)
router.post('/', protect, createPet);
router.put('/:id', protect, updatePet);
router.delete('/:id', protect, deletePet);
router.post('/:id/request', protect, submitRequest);
router.put('/:id/request/:requestId', protect, updateRequestStatus);
router.get('/my/posted', protect, getMyPostedPets);

export default router;