import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import quizRoutes from './routes/quizroutes.js';
import leaderboardRoutes from './routes/leaderboardroutes.js';
import resultRoutes from "./routes/resultroutes.js";
import authRoutes from './routes/authRoutes.js'; // ✅ Added authentication routes

dotenv.config();
const app = express();//  Allow cross-origin requests

app.use(express.json());
app.use(cors());

//  Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));


//  Use Routes
app.use('/api/auth', authRoutes); //  Added authentication API
app.use('/api/quizzes', quizRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use("/api/results", resultRoutes);


//  Start Server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
