import express from 'express';
import { register, login, verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-token', verifyToken);

export default router; // ✅ Use ES Module export
