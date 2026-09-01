import { Router } from 'express';
import * as ctrl from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.post('/process', protect, asyncHandler(ctrl.process));

export default router;
