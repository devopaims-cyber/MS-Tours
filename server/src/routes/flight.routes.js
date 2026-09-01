import { Router } from 'express';
import * as ctrl from '../controllers/flight.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.get('/search', asyncHandler(ctrl.search));
router.get('/:id', asyncHandler(ctrl.getById));

export default router;
