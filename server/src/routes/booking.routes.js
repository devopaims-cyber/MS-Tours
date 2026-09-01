import { Router } from 'express';
import * as ctrl from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.post('/', protect, asyncHandler(ctrl.create));
router.get('/', protect, asyncHandler(ctrl.list));
router.get('/:id', protect, asyncHandler(ctrl.getById));
router.patch('/:id/cancel', protect, asyncHandler(ctrl.cancel));

export default router;
