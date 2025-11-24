import express from "express";
import {
  addWellnessLog,
  editWellnessLog,
  listWellnessLogs,
  removeWellnessLog,
} from "../controllers/wellnessController.js";
import { protect } from "../middleware/authMiddleware.js";
import { wellnessLogValidation } from "../validators/wellnessValidators.js";

const router = express.Router();

router.use(protect);
router.route("/").get(listWellnessLogs).post(wellnessLogValidation, addWellnessLog);
router
  .route("/:id")
  .put(wellnessLogValidation, editWellnessLog)
  .delete(removeWellnessLog);

export default router;

