import { body } from "express-validator";

export const mealValidation = [
  body("meal_name").notEmpty().withMessage("Meal name required"),
  body("meal_type")
    .isIn(["breakfast", "lunch", "dinner", "snack"])
    .withMessage("Meal type invalid"),
  body("calories").isInt({ min: 0 }).withMessage("Calories must be >= 0"),
  body("protein").isInt({ min: 0 }).withMessage("Protein must be >= 0"),
  body("carbs").isInt({ min: 0 }).withMessage("Carbs must be >= 0"),
  body("fats").isInt({ min: 0 }).withMessage("Fats must be >= 0"),
  body("meal_date").isISO8601().withMessage("Valid date required"),
];

