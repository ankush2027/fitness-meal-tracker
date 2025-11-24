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

export const getWaterProgress = async (userId, dailyGoal = 3000) => {
  const [[row]] = await db.query(
    `SELECT COALESCE(SUM(amount_ml), 0) AS total
     FROM water_logs
     WHERE user_id = ?
       AND DATE(logged_at) = CURDATE()`,
    [userId],
  );
  const total = row.total;
  return {
    goal: dailyGoal,
    total,
    percent: Math.min(100, Math.round((total / dailyGoal) * 100)),
  };
};

export const getWellnessSnapshot = async (userId) => {
  const [[latest]] = await db.query(
    `SELECT mood, energy_level, sleep_hours, log_date
     FROM wellness_logs
     WHERE user_id = ?
     ORDER BY log_date DESC
     LIMIT 1`,
    [userId],
  );

  const [[averages]] = await db.query(
    `SELECT
        ROUND(COALESCE(AVG(energy_level), 0), 1) AS energyAvg,
        ROUND(COALESCE(AVG(sleep_hours), 0), 1) AS sleepAvg
     FROM wellness_logs
     WHERE user_id = ?
       AND log_date >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)`,
    [userId],
  );

  return {
    latest: latest || null,
    averages,
  };
};

