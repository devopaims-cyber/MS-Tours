import { Router } from 'express';
import * as ctrl from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

// Profile
router.get('/profile', protect, asyncHandler(ctrl.getProfile));
router.put('/profile', protect, asyncHandler(ctrl.updateProfile));

// Favorites
router.get('/favorites', protect, asyncHandler(ctrl.getFavorites));
router.post('/favorites', protect, asyncHandler(ctrl.addFavorite));
router.delete('/favorites/:packageId', protect, asyncHandler(ctrl.removeFavorite));

export default router;
