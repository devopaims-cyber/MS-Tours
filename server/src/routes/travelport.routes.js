import { Router } from 'express';
import * as ctrl from '../controllers/travelport.controller.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.get('/status', asyncHandler(ctrl.status));
router.post('/search', asyncHandler(ctrl.search));
router.post('/pnr', protect, asyncHandler(ctrl.create));
router.get('/pnr/:locator', protect, asyncHandler(ctrl.retrieve));
router.delete('/pnr/:locator', protect, asyncHandler(ctrl.cancel));

export default router;
