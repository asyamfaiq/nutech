import express from 'express';
import { registerUser, loginUser, getProfile, updateProfileData, uploadProfileImage  } from './user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

import pool from '../config/db.js';


router.get('/', (req, res) => {
      res.send('User route test koneksi');
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile/update', authenticateToken, updateProfileData);
router.post('/profile/image', authenticateToken, upload.single('file'), uploadProfileImage);



router.get('/test-db', async (req, res) => {
  try {
      const result = await pool.query('SELECT current_database(), current_user');
      res.json({ status: 0, message: 'DB connected', data: result.rows[0] });
  } catch (err) {
      console.error(err);
      res.status(500).json({ status: 500, message: 'DB error', data: null });
  }
});

export default router;
