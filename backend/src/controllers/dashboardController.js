import {
  getCalorieSummary,
  getHydrationSummary,
  getLatestBodyMetric,
  getMacroBreakdown,
  getRecentWorkouts,
} from "../models/dashboardModel.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  const waterGoal = parseInt(process.env.DAILY_WATER_GOAL_ML || "3000", 10);

  const [calories, workouts, macros, hydration, latestMetric] = await Promise.all([
    getCalorieSummary(req.user.id),
    getRecentWorkouts(req.user.id),
    getMacroBreakdown(req.user.id),
    getHydrationSummary(req.user.id, waterGoal),
    getLatestBodyMetric(req.user.id),
  ]);

  res.json({
    calories,
    workouts,
    macros,
    hydration,
    latestMetric,
  });
});

