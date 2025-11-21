import express from "express";
import { listSuggestions } from "../controllers/suggestionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, listSuggestions);

export default router;

