import express from 'express';
import { getBanners } from './banner.controller.js';

const router = express.Router();

router.get('/banner', getBanners);

export default router;
