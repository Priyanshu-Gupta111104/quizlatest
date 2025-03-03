import express from "express";
import { getResults } from "../controllers/resultControllers.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ Import authentication middleware

const router = express.Router();

router.get("/", authMiddleware, getResults); // 🔒 Only logged-in users can access quiz results

export default router;
