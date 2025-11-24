import db from "../config/db.js";

export const getCalorieSummary = async (userId) => {
  const [[consumed]] = await db.query(
    `SELECT COALESCE(SUM(calories), 0) AS totalCalories
     FROM meals WHERE user_id = ? AND meal_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
    [userId],
  );

  const [[burned]] = await db.query(
    `SELECT COALESCE(SUM(calories_burned), 0) AS totalCalories
     FROM workouts WHERE user_id = ? AND workout_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
    [userId],
  );

  return {
    consumed: consumed.totalCalories,
    burned: burned.totalCalories,
    net: consumed.totalCalories - burned.totalCalories,
  };
};

export const getRecentWorkouts = async (userId) => {
  const [rows] = await db.query(
    `SELECT workout_type, duration_minutes, calories_burned, workout_date
     FROM workouts
     WHERE user_id = ?
     ORDER BY workout_date DESC
     LIMIT 7`,
    [userId],
  );
  return rows;
};

export const getMacroBreakdown = async (userId) => {
  const [[macros]] = await db.query(
    `SELECT
        COALESCE(SUM(protein),0) AS protein,
        COALESCE(SUM(carbs),0) AS carbs,
        COALESCE(SUM(fats),0) AS fats
     FROM meals
     WHERE user_id = ?
       AND meal_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
    [userId],
  );
  return macros;
};

export const getHydrationSummary = async (userId, dailyGoal = 3000) => {
  const [[today]] = await db.query(
    `SELECT COALESCE(SUM(amount_ml), 0) AS total
     FROM water_logs
     WHERE user_id = ? AND DATE(logged_at) = CURDATE()`,
    [userId],
  );

  const [history] = await db.query(
    `SELECT DATE(logged_at) AS date, SUM(amount_ml) AS total
     FROM water_logs
     WHERE user_id = ? AND logged_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
     GROUP BY DATE(logged_at)
     ORDER BY DATE(logged_at) ASC`,
    [userId],
  );

  return {
    goal: dailyGoal,
    today: today.total,
    history,
    percent: Math.min(100, Math.round((today.total / dailyGoal) * 100)),
  };
};

export const getLatestBodyMetric = async (userId) => {
  const [[latest]] = await db.query(
    `SELECT weight_kg, body_fat_percent, notes, recorded_at
     FROM body_metrics
     WHERE user_id = ?
     ORDER BY recorded_at DESC, created_at DESC
     LIMIT 1`,
    [userId],
  );
  return latest || null;
};
