import db from "../config/db.js";

export const getSuggestionsByGoal = async (goal) => {
  const [rows] = await db.query(
    `SELECT * FROM meal_suggestions
     WHERE goal = ? ORDER BY priority ASC`,
    [goal],
  );
  return rows;
};

