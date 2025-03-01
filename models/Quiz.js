import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    timer: { type: Number, required: true },
    questions: [{
        text: { type: String, required: true },
        options: { type: [String], required: true },
        correct: { type: Number, required: true }
    }],
    code: {  
        type: String, 
        unique: true, 
        default: () => nanoid(6), // ✅ Generates a 6-character unique code
        required: true
    },
    quizCode: {  // ✅ Include quizCode for compatibility with MongoDB Atlas
        type: String,
        unique: true,
        default: () => nanoid(6),
        required: true
    }
}, { collection: 'quizzes' });

export default mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
