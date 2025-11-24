import { body } from "express-validator";

export const bodyMetricValidation = [
  body("weight_kg")
    .isFloat({ min: 30, max: 300 })
    .withMessage("Weight must be between 30kg and 300kg"),
  body("body_fat_percent")
    .optional({ nullable: true })
    .isFloat({ min: 3, max: 70 })
    .withMessage("Body fat percentage must be between 3% and 70%"),
  body("notes")
    .optional({ nullable: true })
    .isLength({ max: 255 })
    .withMessage("Notes must be 255 characters or less")
    .trim()
    .escape(),
  body("recorded_at")
    .isISO8601()
    .withMessage("Valid recorded date required")
    .custom((value) => {
      const recorded = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (recorded > today) {
        throw new Error("Recorded date cannot be in the future");
      }
      return true;
    }),
];

