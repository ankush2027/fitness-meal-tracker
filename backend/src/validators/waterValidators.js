
import { body } from "express-validator";

export const waterLogValidation = [
  body("amount_ml")
    .isInt({ min: 50, max: 2000 })
    .withMessage("Water amount must be between 50ml and 2000ml"),
  body("logged_at")
    .optional()
    .isISO8601()
    .withMessage("Logged time must be a valid ISO date")
    .custom((value) => {
      if (!value) return true;
      const date = new Date(value);
      const now = new Date();
      if (date > now) {
        throw new Error("Logged time cannot be in the future");
      }
      return true;
    }),
  body("note")
    .optional({ values: "falsy" })
    .isLength({ max: 255 })
    .withMessage("Note must be less than 255 characters")
    .trim()
    .escape(),
];

