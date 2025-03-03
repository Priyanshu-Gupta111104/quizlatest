import express from 'express';
import { submitQuiz, getLeaderboard } from '../controllers/leaderboardcontroller.js';
import authMiddleware from '../middleware/authMiddleware.js'; // ✅ Import authentication middleware

const router = express.Router();

router.post('/:code/submit', authMiddleware, submitQuiz); // 🔒 Only logged-in users can submit a quiz
// ✅ Secure route: Fetch full leaderboard (Pass `req` explicitly)
router.get("/", authMiddleware, (req, res) => getLeaderboard(req, res));

// ✅ Secure route: Fetch leaderboard for a specific quiz
router.get("/:quizCode", authMiddleware, (req, res) => getLeaderboard(req, res));

export default router;
