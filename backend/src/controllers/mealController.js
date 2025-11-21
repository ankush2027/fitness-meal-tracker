import { validationResult } from "express-validator";
import {
  createMeal,
  deleteMeal,
  getMealById,
  getMealsByUser,
  updateMeal,
} from "../models/mealModel.js";
import asyncHandler from "../utils/asyncHandler.js";

export const listMeals = asyncHandler(async (req, res) => {
  const meals = await getMealsByUser(req.user.id);
  res.json({ meals });
});

export const addMeal = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const meal = await createMeal(req.user.id, req.body);
  res.status(201).json({ meal });
});

export const editMeal = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const existing = await getMealById(req.user.id, id);
  if (!existing) {
    return res.status(404).json({ message: "Meal not found" });
  }

  const updated = await updateMeal(req.user.id, id, req.body);
  res.json({ meal: updated });
});

export const removeMeal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await getMealById(req.user.id, id);
  if (!existing) {
    return res.status(404).json({ message: "Meal not found" });
  }

  await deleteMeal(req.user.id, id);
  res.status(204).send();
});

