import express from 'express';
import { getLeaderboard, addResult } from '../controllers/leaderboardcontroller.js';

const router = express.Router();

router.get('/', getLeaderboard);  // Fetch leaderboard
router.post('/', addResult);      // Add new quiz result

export default router;
