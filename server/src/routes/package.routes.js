import { Router } from 'express';
import * as ctrl from '../controllers/package.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.get('/search', asyncHandler(ctrl.search));
router.get('/featured', asyncHandler(ctrl.featured));
router.get('/', asyncHandler(ctrl.list));
router.get('/:id', asyncHandler(ctrl.getById));

export default router;
