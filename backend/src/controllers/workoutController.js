import { validationResult } from "express-validator";
import {
  createWorkout,
  deleteWorkout,
  getWorkoutById,
  getWorkoutsByUser,
  updateWorkout,
} from "../models/workoutModel.js";
import asyncHandler from "../utils/asyncHandler.js";

export const listWorkouts = asyncHandler(async (req, res) => {
  const workouts = await getWorkoutsByUser(req.user.id);
  res.json({ workouts });
});

export const addWorkout = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const workout = await createWorkout(req.user.id, req.body);
  res.status(201).json({ workout });
});

export const editWorkout = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const existing = await getWorkoutById(req.user.id, id);
  if (!existing) {
    return res.status(404).json({ message: "Workout not found" });
  }

  const updated = await updateWorkout(req.user.id, id, req.body);
  res.json({ workout: updated });
});

export const removeWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await getWorkoutById(req.user.id, id);
  if (!existing) {
    return res.status(404).json({ message: "Workout not found" });
  }

  await deleteWorkout(req.user.id, id);
  res.status(204).send();
});

