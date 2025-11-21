import db from "../config/db.js";

export const getExercises = async ({ query }) => {
  if (query) {
    const likeQuery = `%${query}%`;
    const [rows] = await db.query(
      `SELECT * FROM exercises
       WHERE name LIKE ? OR target_muscle LIKE ? OR description LIKE ?
       ORDER BY name ASC`,
      [likeQuery, likeQuery, likeQuery],
    );
    return rows;
  }

  const [rows] = await db.query("SELECT * FROM exercises ORDER BY name ASC");
  return rows;
};

