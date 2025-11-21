import db from "../config/db.js";

export const getWorkoutsByUser = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM workouts WHERE user_id = ? ORDER BY workout_date DESC",
    [userId],
  );
  return rows;
};

export const getWorkoutById = async (userId, workoutId) => {
  const [rows] = await db.query(
    "SELECT * FROM workouts WHERE user_id = ? AND id = ?",
    [userId, workoutId],
  );
  return rows[0];
};

export const createWorkout = async (userId, workout) => {
  const [result] = await db.query(
    `INSERT INTO workouts (user_id, workout_type, duration_minutes, calories_burned, workout_date)
     VALUES (?, ?, ?, ?, ?)`,
    [
      userId,
      workout.workout_type,
      workout.duration_minutes,
      workout.calories_burned,
      workout.workout_date,
    ],
  );
  return { id: result.insertId, ...workout };
};

export const updateWorkout = async (userId, workoutId, workout) => {
  await db.query(
    `UPDATE workouts
     SET workout_type = ?, duration_minutes = ?, calories_burned = ?, workout_date = ?
     WHERE id = ? AND user_id = ?`,
    [
      workout.workout_type,
      workout.duration_minutes,
      workout.calories_burned,
      workout.workout_date,
      workoutId,
      userId,
    ],
  );
  return getWorkoutById(userId, workoutId);
};

export const deleteWorkout = async (userId, workoutId) => {
  await db.query("DELETE FROM workouts WHERE id = ? AND user_id = ?", [
    workoutId,
    userId,
  ]);
};

