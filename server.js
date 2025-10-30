import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './src/config/db.js';

import userRoutes from './src/user/user.routes.js';
import bannerRoutes from './src/banner/banner.routes.js';
import serviceRoutes from './src/services/service.routes.js';
import balanceRoutes from './src/balance/balance.routes.js';
import transactionRoutes from './src/transaction/transaction.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', bannerRoutes);
app.use('/api', serviceRoutes);
app.use('/api', balanceRoutes);
app.use('/api', balanceRoutes);
app.use('/api', transactionRoutes);

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
