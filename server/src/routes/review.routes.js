import { Router } from 'express';
import * as ctrl from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.get('/package/:packageId', asyncHandler(ctrl.listForPackage));
router.get('/hotel/:hotelId', asyncHandler(ctrl.listForHotel));
router.post('/', protect, asyncHandler(ctrl.create));

export default router;
