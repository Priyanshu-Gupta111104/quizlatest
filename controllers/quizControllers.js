import Quiz from '../models/Quiz.js';
import Leaderboard from "../models/Leaderboard.js"; //
import Result from '../models/result.js'; //
import { nanoid } from 'nanoid';

// Create a quiz
export const createQuiz = async (req, res) => {
    try {
        const { title, description, timer, questions } = req.body;

        if (!title || !description || !timer || !questions || !questions.length) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const generatedCode = nanoid(6);

        const quiz = new Quiz({
            title,
            description,
            timer,
            questions,
            code: generatedCode,  // ✅ Store in both fields
            quizCode: generatedCode
        });

        await quiz.save();
        res.status(201).json({ message: 'Quiz created successfully', code: quiz.code, quizCode: quiz.quizCode });
    } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ error: 'Failed to create quiz', details: error.message });
    }
};

// ✅ Fetch quiz by code (case-insensitive search)
export const getQuizById = async (req, res) => {
    try {
        let { code } = req.params;
        code = code.trim(); // ✅ Remove spaces

        console.log("🔍 Searching for Quiz with Code:", code);

        const quiz = await Quiz.findOne({ quizCode: new RegExp(`^${code}$`, 'i') }); // ✅ Case-insensitive search

        if (!quiz) {
            console.log("❌ Quiz Not Found:", code);
            return res.status(404).json({ error: 'Quiz not found' });
        }

        console.log("✅ Quiz Found:", quiz);
        res.status(200).json(quiz);
    } catch (error) {
        console.error("❌ Error fetching quiz:", error);
        res.status(500).json({ error: 'Failed to fetch quiz', details: error.message });
    }
};

export const submitQuiz = async (req, res) => {
    try {
        const { code } = req.params;
        const { userName, answers } = req.body;

        console.log("🔍 Received quiz submission for code:", code);
        console.log("🔍 User:", userName, "Answers:", answers);
           
        // Find the quiz by code
        const quiz = await Quiz.findOne({ quizCode: code });

        if (!quiz) {
            console.log("❌ Quiz not found for code:", code);
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // ✅ Calculate score
        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (answers[index] === question.correct) {
                score++;
            }
        });

        // ✅ Create leaderboard entry
        const newLeaderboardEntry = new Leaderboard({
            userName,
            quizCode: code,
            quizTitle: quiz.title,
            score,
            timeTaken: quiz.timer // Assuming full timer used
        });

        console.log("🔹 New Leaderboard Entry:", newLeaderboardEntry);

        // ✅ Save to Leaderboard
        await newLeaderboardEntry.save();
        console.log("✅ Leaderboard Entry Saved Successfully!");

        // ✅ Create results entry
        const newResultEntry = new Result({
            userName,
            quizId: quiz._id.toString(),
            quizTitle: quiz.title,
            score,
            timeTaken: quiz.timer
        });

        console.log("🔹 New Result Entry:", newResultEntry);

        // ✅ Save to Results
        await newResultEntry.save();
        console.log("✅ Results Entry Saved Successfully!");

        res.status(200).json({ message: 'Quiz submitted successfully', score });
    } catch (error) {
        console.error("❌ Error submitting quiz:", error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
};

export const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({}, 'quizCode title'); // ✅ Fetch quizzes with title & code
        res.status(200).json(quizzes);
    } catch (error) {
        console.error("❌ Error fetching quizzes:", error);
        res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
};
