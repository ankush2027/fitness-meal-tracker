import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET || "supersecret", {
    expiresIn: "7d",
  });

export const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, goal } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, hashedPassword, goal });
  const token = generateToken(user.id);

  res.status(201).json({
    user,
    token,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user.id);
  res.json({
    user: { id: user.id, name: user.name, email: user.email, goal: user.goal },
    token,
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);
  res.json({ user });
});

