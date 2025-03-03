import express from 'express';
import { createQuiz, getQuizById, submitQuiz, getQuizzes } from '../controllers/quizControllers.js';
import authMiddleware from '../middleware/authMiddleware.js'; // ✅ Import authentication middleware

const router = express.Router();

router.post('/', authMiddleware, createQuiz); // 🔒 Only logged-in users can create a quiz
router.get('/:code', getQuizById); // ✅ Public: Anyone can view quiz by code
router.post('/:code/submit', authMiddleware, submitQuiz); // 🔒 Only logged-in users can submit a quiz
router.get('/', getQuizzes); // ✅ Public: Fetch all quizzes

export default router;
