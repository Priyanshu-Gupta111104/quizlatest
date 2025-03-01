import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, required: true },
    quizTitle: { type: String, required: true },
    score: { type: Number, required: true },
    timeTaken: { type: Number, required: true }
}, { collection: "results" });

export default mongoose.models.Result || mongoose.model("Result", resultSchema);
