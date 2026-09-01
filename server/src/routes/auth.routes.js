import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.post('/register', asyncHandler(ctrl.register));
router.post('/login', asyncHandler(ctrl.login));
router.get('/me', protect, asyncHandler(ctrl.me));

export default router;
