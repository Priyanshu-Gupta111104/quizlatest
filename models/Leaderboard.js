import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    quizCode: { type: String, required: true },
    quizTitle: { type: String, required: true },
    score: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
}, { collection: "leaderboards" });

export default mongoose.models.Leaderboard || mongoose.model("Leaderboard", leaderboardSchema);
