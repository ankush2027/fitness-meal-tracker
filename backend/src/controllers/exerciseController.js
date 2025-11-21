import { getExercises } from "../models/exerciseModel.js";
import asyncHandler from "../utils/asyncHandler.js";

export const listExercises = asyncHandler(async (req, res) => {
  const exercises = await getExercises({ query: req.query.q });
  res.json({ exercises });
});

