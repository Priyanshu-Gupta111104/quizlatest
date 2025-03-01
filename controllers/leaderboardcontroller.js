import Leaderboard from '../models/Leaderboard.js';
import Quiz from '../models/Quiz.js';

// Submit quiz responses
export const submitQuiz = async (req, res) => {
    try {
        const { userName, answers } = req.body;
        const quiz = await Quiz.findById(req.params.code);

        let score = 0;
        answers.forEach((ans, i) => {
            if (quiz.questions[i].correct === ans) score++;
        });

        const result = new Leaderboard({
            quizId: quiz._id,
            userName,
            score: (score / quiz.questions.length) * 100
        });

        await result.save();
        res.json({ score: result.score });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const { quizCode } = req.params;
        let leaderboardData;

        if (quizCode) {
            leaderboardData = await Leaderboard.find({ quizCode }).sort({ score: -1 });
        } else {
            leaderboardData = await Leaderboard.find().sort({ score: -1 });
        }

        res.status(200).json(leaderboardData);
    } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
};
