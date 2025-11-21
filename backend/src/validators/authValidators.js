import { body } from "express-validator";

/**
 * Password strength validation
 * Requires: min 8 chars, at least one uppercase, one lowercase, one number
 */
const passwordStrength = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage(
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("Name can only contain letters, spaces, hyphens, and apostrophes"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email required")
    .normalizeEmail()
    .isLength({ max: 150 })
    .withMessage("Email must be less than 150 characters"),
  passwordStrength,
  body("goal")
    .isIn(["weight_loss", "muscle_gain", "maintenance"])
    .withMessage("Goal must be one of weight_loss, muscle_gain, maintenance"),
];

export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email required")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password required"),
];

