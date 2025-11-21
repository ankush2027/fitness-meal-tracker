import { body } from "express-validator";

export const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password too short"),
  body("goal")
    .isIn(["weight_loss", "muscle_gain", "maintenance"])
    .withMessage("Goal must be one of weight_loss, muscle_gain, maintenance"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required"),
];

