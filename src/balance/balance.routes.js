import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getBalance, topUpBalance } from './balance.controller.js';

const router = express.Router();

router.get('/balance', authenticateToken, getBalance);
router.post('/topup', authenticateToken, topUpBalance);

export default router;

