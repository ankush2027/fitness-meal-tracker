import express from "express";
import { listExercises } from "../controllers/exerciseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, listExercises);

export default router;

