import db from "../config/db.js";

export const getMealsByUser = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM meals WHERE user_id = ? ORDER BY meal_date DESC",
    [userId],
  );
  return rows;
};

export const getMealById = async (userId, mealId) => {
  const [rows] = await db.query(
    "SELECT * FROM meals WHERE user_id = ? AND id = ?",
    [userId, mealId],
  );
  return rows[0];
};

export const createMeal = async (userId, meal) => {
  const [result] = await db.query(
    `INSERT INTO meals
    (user_id, meal_name, meal_type, calories, protein, carbs, fats, meal_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      meal.meal_name,
      meal.meal_type,
      meal.calories,
      meal.protein,
      meal.carbs,
      meal.fats,
      meal.meal_date,
    ],
  );
  return { id: result.insertId, ...meal };
};

export const updateMeal = async (userId, mealId, meal) => {
  await db.query(
    `UPDATE meals
     SET meal_name = ?, meal_type = ?, calories = ?, protein = ?, carbs = ?, fats = ?, meal_date = ?
     WHERE id = ? AND user_id = ?`,
    [
      meal.meal_name,
      meal.meal_type,
      meal.calories,
      meal.protein,
      meal.carbs,
      meal.fats,
      meal.meal_date,
      mealId,
      userId,
    ],
  );
  return getMealById(userId, mealId);
};

export const deleteMeal = async (userId, mealId) => {
  await db.query("DELETE FROM meals WHERE id = ? AND user_id = ?", [
    mealId,
    userId,
  ]);
};

