import db from "../config/db.js";

export const getWellnessLogsByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT id, mood, energy_level, sleep_hours, notes, log_date
     FROM wellness_logs
     WHERE user_id = ?
     ORDER BY log_date DESC`,
    [userId],
  );
  return rows;
};

export const getWellnessLogById = async (userId, logId) => {
  const [rows] = await db.query(
    `SELECT id, mood, energy_level, sleep_hours, notes, log_date
     FROM wellness_logs
     WHERE user_id = ? AND id = ?`,
    [userId, logId],
  );
  return rows[0];
};

export const createWellnessLog = async (
  userId,
  { mood, energy_level, sleep_hours, notes, log_date },
) => {
  const [result] = await db.query(
    `INSERT INTO wellness_logs (user_id, mood, energy_level, sleep_hours, notes, log_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, mood, energy_level, sleep_hours, notes || null, log_date],
  );
  return getWellnessLogById(userId, result.insertId);
};

export const updateWellnessLog = async (
  userId,
  logId,
  { mood, energy_level, sleep_hours, notes, log_date },
) => {
  await db.query(
    `UPDATE wellness_logs
     SET mood = ?, energy_level = ?, sleep_hours = ?, notes = ?, log_date = ?
     WHERE id = ? AND user_id = ?`,
    [mood, energy_level, sleep_hours, notes || null, log_date, logId, userId],
  );
  return getWellnessLogById(userId, logId);
};

export const deleteWellnessLog = async (userId, logId) => {
  await db.query(`DELETE FROM wellness_logs WHERE id = ? AND user_id = ?`, [
    logId,
    userId,
  ]);
};

export const getWeeklyMoodSummary = async (userId) => {
  const [rows] = await db.query(
    `SELECT mood, COUNT(*) AS count
     FROM wellness_logs
     WHERE user_id = ?
       AND log_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
     GROUP BY mood`,
    [userId],
  );
  return rows;
};

export const getAverageSleepHours = async (userId) => {
  const [[row]] = await db.query(
    `SELECT ROUND(COALESCE(AVG(sleep_hours), 0), 1) AS avgSleep
     FROM wellness_logs
     WHERE user_id = ?
       AND log_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
    [userId],
  );
  return row.avgSleep;
};

