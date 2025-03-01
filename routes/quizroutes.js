import express from 'express';
import { createQuiz, getQuizById,submitQuiz,getQuizzes } from '../controllers/quizControllers.js';

const router = express.Router();

router.post('/', createQuiz);
router.get('/:code', getQuizById);
router.post('/:code/submit', submitQuiz); // ✅ Submit quiz answers
router.get('/', getQuizzes); // ✅ Fetch all quizzes
export default router;
