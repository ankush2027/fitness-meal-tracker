import express from "express";
import {
  addBodyMetric,
  editBodyMetric,
  listBodyMetrics,
  removeBodyMetric,
} from "../controllers/bodyMetricController.js";
import { protect } from "../middleware/authMiddleware.js";
import { bodyMetricValidation } from "../validators/bodyMetricValidators.js";

const router = express.Router();

router.use(protect);
router
  .route("/")
  .get(listBodyMetrics)
  .post(bodyMetricValidation, addBodyMetric);
router
  .route("/:id")
  .put(bodyMetricValidation, editBodyMetric)
  .delete(removeBodyMetric);

export default router;

