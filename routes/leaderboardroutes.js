import express from 'express';
import { submitQuiz, getLeaderboard } from '../controllers/leaderboardcontroller.js';

const router = express.Router();

router.post('/:code/submit', submitQuiz);
router.get("/", getLeaderboard); // ✅ Get full leaderboard
router.get("/:quizCode", getLeaderboard); // ✅ Get leaderboard for a specific quiz


export default router;
