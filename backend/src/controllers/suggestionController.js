import { getSuggestionsByGoal } from "../models/suggestionModel.js";
import asyncHandler from "../utils/asyncHandler.js";

export const listSuggestions = asyncHandler(async (req, res) => {
  const goal = req.query.goal || req.user?.goal || "maintenance";
  const suggestions = await getSuggestionsByGoal(goal);
  res.json({ suggestions });
});

