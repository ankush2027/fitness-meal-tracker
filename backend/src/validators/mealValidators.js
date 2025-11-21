import { body } from "express-validator";

export const mealValidation = [
  body("meal_name")
    .trim()
    .notEmpty()
    .withMessage("Meal name required")
    .isLength({ min: 1, max: 150 })
    .withMessage("Meal name must be between 1 and 150 characters")
    .escape(),
  body("meal_type")
    .isIn(["breakfast", "lunch", "dinner", "snack"])
    .withMessage("Meal type must be breakfast, lunch, dinner, or snack"),
  body("calories")
    .isInt({ min: 0, max: 10000 })
    .withMessage("Calories must be between 0 and 10,000"),
  body("protein")
    .isInt({ min: 0, max: 1000 })
    .withMessage("Protein must be between 0 and 1,000 grams"),
  body("carbs")
    .isInt({ min: 0, max: 1000 })
    .withMessage("Carbs must be between 0 and 1,000 grams"),
  body("fats")
    .isInt({ min: 0, max: 1000 })
    .withMessage("Fats must be between 0 and 1,000 grams"),
  body("meal_date")
    .isISO8601()
    .withMessage("Valid date required")
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (date > today) {
        throw new Error("Meal date cannot be in the future");
      }
      return true;
    }),
];

