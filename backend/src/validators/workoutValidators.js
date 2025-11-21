import { body } from "express-validator";

export const workoutValidation = [
  body("workout_type").notEmpty().withMessage("Workout type required"),
  body("duration_minutes")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer"),
  body("calories_burned")
    .isInt({ min: 0 })
    .withMessage("Calories must be zero or greater"),
  body("workout_date").isISO8601().withMessage("Valid date required"),
];

