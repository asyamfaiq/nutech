import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getTransactionHistory, createTransaction } from './transaction.controller.js';

const router = express.Router();

router.get('/transaction/history', authenticateToken, getTransactionHistory);
router.post('/transaction', authenticateToken, createTransaction);


export default router;
