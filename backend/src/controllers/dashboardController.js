import {
  getCalorieSummary,
  getMacroBreakdown,
  getRecentWorkouts,
  getWaterProgress,
  getWellnessSnapshot,
} from "../models/dashboardModel.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  const [calories, workouts, macros, water, wellness] = await Promise.all([
    getCalorieSummary(req.user.id),
    getRecentWorkouts(req.user.id),
    getMacroBreakdown(req.user.id),
    getWaterProgress(req.user.id, parseInt(process.env.DAILY_WATER_GOAL_ML || "3000", 10)),
    getWellnessSnapshot(req.user.id),
  ]);

  res.json({
    calories,
    workouts,
    macros,
    water,
    wellness,
  });
});

