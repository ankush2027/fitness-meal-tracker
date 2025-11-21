import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret === "supersecret") {
    console.warn("⚠️  Warning: Using default JWT secret. Set JWT_SECRET in production!");
  }
  return jwt.sign({ id: userId }, jwtSecret || "supersecret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }

  // Sanitize inputs
  const { name, email, password, goal } = req.body;
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  const existingUser = await findUserByEmail(trimmedEmail);
  if (existingUser) {
    return res.status(409).json({
      message: "Email already registered",
      field: "email",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12); // Increased rounds for better security
  const user = await createUser({
    name: trimmedName,
    email: trimmedEmail,
    hashedPassword,
    goal,
  });
  const token = generateToken(user.id);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      goal: user.goal,
    },
    token,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }

  // Sanitize email
  const { email, password } = req.body;
  const trimmedEmail = email.trim().toLowerCase();

  const user = await findUserByEmail(trimmedEmail);

  if (!user) {
    // Use same message for both cases to prevent user enumeration
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user.id);
  res.json({
    message: "Login successful",
    user: { id: user.id, name: user.name, email: user.email, goal: user.goal },
    token,
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);
  res.json({ user });
});

