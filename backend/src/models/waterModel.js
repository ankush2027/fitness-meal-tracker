
import db from "../config/db.js";

export const getWaterLogsByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT id, amount_ml, logged_at, note
     FROM water_logs
     WHERE user_id = ?
     ORDER BY logged_at DESC`,
    [userId],
  );
  return rows;
};

export const getWaterLogById = async (userId, logId) => {
  const [rows] = await db.query(
    `SELECT id, amount_ml, logged_at, note
     FROM water_logs
     WHERE user_id = ? AND id = ?`,
    [userId, logId],
  );
  return rows[0];
};

export const createWaterLog = async (userId, { amount_ml, logged_at, note }) => {
  const [result] = await db.query(
    `INSERT INTO water_logs (user_id, amount_ml, logged_at, note)
     VALUES (?, ?, ?, ?)`,
    [userId, amount_ml, logged_at, note || null],
  );
  return getWaterLogById(userId, result.insertId);
};

export const updateWaterLog = async (
  userId,
  logId,
  { amount_ml, logged_at, note },
) => {
  await db.query(
    `UPDATE water_logs
     SET amount_ml = ?, logged_at = ?, note = ?
     WHERE id = ? AND user_id = ?`,
    [amount_ml, logged_at, note || null, logId, userId],
  );
  return getWaterLogById(userId, logId);
};

export const deleteWaterLog = async (userId, logId) => {
  await db.query(`DELETE FROM water_logs WHERE id = ? AND user_id = ?`, [
    logId,
    userId,
  ]);
};

export const getTodayWaterTotal = async (userId) => {
  const [[row]] = await db.query(
    `SELECT COALESCE(SUM(amount_ml), 0) AS total
     FROM water_logs
     WHERE user_id = ?
       AND DATE(logged_at) = CURDATE()`,
    [userId],
  );
  return row.total;
};

