import { body } from "express-validator";

export const workoutValidation = [
  body("workout_type")
    .trim()
    .notEmpty()
    .withMessage("Workout type required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Workout type must be between 1 and 100 characters")
    .escape(),
  body("duration_minutes")
    .isInt({ min: 1, max: 1440 })
    .withMessage("Duration must be between 1 and 1440 minutes (24 hours)"),
  body("calories_burned")
    .isInt({ min: 0, max: 10000 })
    .withMessage("Calories burned must be between 0 and 10,000"),
  body("workout_date")
    .isISO8601()
    .withMessage("Valid date required")
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (date > today) {
        throw new Error("Workout date cannot be in the future");
      }
      return true;
    }),
];

