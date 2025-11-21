import express from "express";
import {
  addWorkout,
  editWorkout,
  listWorkouts,
  removeWorkout,
} from "../controllers/workoutController.js";
import { protect } from "../middleware/authMiddleware.js";
import { workoutValidation } from "../validators/workoutValidators.js";

const router = express.Router();

router.use(protect);
router.route("/").get(listWorkouts).post(workoutValidation, addWorkout);
router
  .route("/:id")
  .put(workoutValidation, editWorkout)
  .delete(removeWorkout);

export default router;

