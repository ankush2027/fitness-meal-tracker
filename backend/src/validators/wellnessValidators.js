import { body } from "express-validator";

export const wellnessLogValidation = [
  body("mood")
    .isIn(["low", "neutral", "high"])
    .withMessage("Mood must be low, neutral, or high"),
  body("energy_level")
    .isInt({ min: 1, max: 10 })
    .withMessage("Energy level must be between 1 and 10"),
  body("sleep_hours")
    .isFloat({ min: 0, max: 24 })
    .withMessage("Sleep hours must be between 0 and 24"),
  body("notes")
    .optional({ values: "falsy" })
    .isLength({ max: 255 })
    .withMessage("Notes must be less than 255 characters")
    .trim()
    .escape(),
  body("log_date")
    .isISO8601()
    .withMessage("Log date must be a valid date")
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date > today) {
        throw new Error("Log date cannot be in the future");
      }
      return true;
    }),
];

