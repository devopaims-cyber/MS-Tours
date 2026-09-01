import { Router } from 'express';
import * as ctrl from '../controllers/destination.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.get('/', asyncHandler(ctrl.list));
router.get('/:id', asyncHandler(ctrl.getById));

export default router;
