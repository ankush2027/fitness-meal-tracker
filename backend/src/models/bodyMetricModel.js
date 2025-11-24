import db from "../config/db.js";

export const getBodyMetricsByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM body_metrics
     WHERE user_id = ?
     ORDER BY recorded_at DESC, created_at DESC`,
    [userId],
  );
  return rows;
};

export const getBodyMetricById = async (userId, metricId) => {
  const [rows] = await db.query(
    "SELECT * FROM body_metrics WHERE user_id = ? AND id = ?",
    [userId, metricId],
  );
  return rows[0];
};

export const createBodyMetric = async (userId, metric) => {
  const [result] = await db.query(
    `INSERT INTO body_metrics (user_id, weight_kg, body_fat_percent, notes, recorded_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      userId,
      metric.weight_kg,
      metric.body_fat_percent ?? null,
      metric.notes ?? null,
      metric.recorded_at,
    ],
  );
  return { id: result.insertId, ...metric };
};

export const updateBodyMetric = async (userId, metricId, metric) => {
  await db.query(
    `UPDATE body_metrics
     SET weight_kg = ?, body_fat_percent = ?, notes = ?, recorded_at = ?
     WHERE id = ? AND user_id = ?`,
    [
      metric.weight_kg,
      metric.body_fat_percent ?? null,
      metric.notes ?? null,
      metric.recorded_at,
      metricId,
      userId,
    ],
  );
  return getBodyMetricById(userId, metricId);
};

export const deleteBodyMetric = async (userId, metricId) => {
  await db.query("DELETE FROM body_metrics WHERE id = ? AND user_id = ?", [
    metricId,
    userId,
  ]);
};

export const getLatestBodyMetric = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM body_metrics
     WHERE user_id = ?
     ORDER BY recorded_at DESC, created_at DESC
     LIMIT 1`,
    [userId],
  );
  return rows[0];
};

