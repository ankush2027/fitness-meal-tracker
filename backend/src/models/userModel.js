import db from "../config/db.js";

export const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, name, email, goal FROM users WHERE id = ?",
    [id],
  );
  return rows[0];
};

export const createUser = async ({ name, email, hashedPassword, goal }) => {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, goal) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, goal],
  );
  return { id: result.insertId, name, email, goal };
};

