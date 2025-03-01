import express from "express";
import { getResults } from "../controllers/resultControllers.js";

const router = express.Router();

router.get("/", getResults);

export default router;
