import {
  getCalorieSummary,
  getMacroBreakdown,
  getRecentWorkouts,
} from "../models/dashboardModel.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  const [calories, workouts, macros] = await Promise.all([
    getCalorieSummary(req.user.id),
    getRecentWorkouts(req.user.id),
    getMacroBreakdown(req.user.id),
  ]);

  res.json({
    calories,
    workouts,
    macros,
  });
});

