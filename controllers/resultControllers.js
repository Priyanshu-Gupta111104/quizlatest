import Result from '../models/result.js';

// ✅ Fetch all quiz results (sorted by highest score)
export const getResults = async (req, res) => {
    try {
        console.log("🔍 Fetching quiz results...");

        const results = await Result.find().sort({ score: -1 });

        if (!results || results.length === 0) {
            console.log("⚠ No quiz results found.");
            return res.status(404).json({ message: "No quiz results available." });
        }

        console.log("✅ Results Fetched:", results.length);
        res.status(200).json(results);
    } catch (error) {
        console.error("❌ Error fetching results:", error);
        res.status(500).json({ error: "Failed to fetch results" });
    }
};

// ✅ Save Quiz Results (Dynamically Calculates Score Based on Total Questions)
export const saveQuizResult = async (req, res) => {
    try {
        const { userName, quizId, quizTitle, selectedAnswers, correctAnswers } = req.body;

        if (!userName || !quizId || !quizTitle || !selectedAnswers || !correctAnswers) {
            return res.status(400).json({ message: "Missing required fields!" });
        }

        // ✅ Calculate correct answers & total questions
        const totalQuestions = correctAnswers.length;
        const correctCount = correctAnswers.filter((answer, index) => answer === selectedAnswers[index]).length;

        // ✅ New Score Formula: (Correct Answers / Total Questions) * 100
        const scorePercentage = ((correctCount / totalQuestions) * 100).toFixed(2);

        console.log(`📊 User: ${userName} | Correct: ${correctCount}/${totalQuestions} | Score: ${scorePercentage}%`);

        // ✅ Save result to MongoDB
        const newResult = new Result({
            userName,
            quizId,
            quizTitle,
            correctAnswers: correctCount,
            totalQuestions,
            score: scorePercentage,
        });

        await newResult.save();
        res.status(201).json({ message: "Result saved successfully!", score: scorePercentage });

    } catch (error) {
        console.error("❌ Error saving quiz result:", error);
        res.status(500).json({ message: "Failed to save result." });
    }
};
