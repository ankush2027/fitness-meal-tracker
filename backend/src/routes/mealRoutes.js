import express from "express";
import {
  addMeal,
  editMeal,
  listMeals,
  removeMeal,
  analyzeAndSaveMeal,
} from "../controllers/mealController.js";
import { protect } from "../middleware/authMiddleware.js";
import { mealValidation } from "../validators/mealValidators.js";

const router = express.Router();

router.use(protect);
router.route("/").get(listMeals).post(mealValidation, addMeal);
router.route("/analyze-save").post(analyzeAndSaveMeal);
router.route("/:id").put(mealValidation, editMeal).delete(removeMeal);

export default router;


