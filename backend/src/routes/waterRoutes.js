import express from "express";
import {
  addWaterLog,
  editWaterLog,
  listWaterLogs,
  removeWaterLog,
} from "../controllers/waterController.js";
import { protect } from "../middleware/authMiddleware.js";
import { waterLogValidation } from "../validators/waterValidators.js";

const router = express.Router();

router.use(protect);
router.route("/").get(listWaterLogs).post(waterLogValidation, addWaterLog);
router
  .route("/:id")
  .put(waterLogValidation, editWaterLog)
  .delete(removeWaterLog);

export default router;

