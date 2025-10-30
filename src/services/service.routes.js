import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getServices } from './service.controller.js';

const router = express.Router();

router.get('/services', authenticateToken, getServices);

export default router;
