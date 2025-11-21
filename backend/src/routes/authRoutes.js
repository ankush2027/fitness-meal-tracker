import express from "express";
import {
  loginUser,
  registerUser,
  getProfile,
} from "../controllers/authController.js";
import {
  loginValidation,
  registerValidation,
} from "../validators/authValidators.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.get("/profile", protect, getProfile);

export default router;

