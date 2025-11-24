import { validationResult } from "express-validator";
import {
  createWellnessLog,
  deleteWellnessLog,
  getAverageSleepHours,
  getWellnessLogById,
  getWellnessLogsByUser,
  getWeeklyMoodSummary,
  updateWellnessLog,
} from "../models/wellnessModel.js";
import asyncHandler from "../utils/asyncHandler.js";

export const listWellnessLogs = asyncHandler(async (req, res) => {
  const logs = await getWellnessLogsByUser(req.user.id);
  const summary = await getWeeklyMoodSummary(req.user.id);
  const avgSleep = await getAverageSleepHours(req.user.id);
  res.json({ logs, summary, avgSleep });
});

export const addWellnessLog = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const log = await createWellnessLog(req.user.id, req.body);
  res.status(201).json({ log });
});

export const editWellnessLog = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const { id } = req.params;
  const existing = await getWellnessLogById(req.user.id, id);
  if (!existing) {
    return res.status(404).json({ message: "Wellness log not found" });
  }

  const updated = await updateWellnessLog(req.user.id, id, req.body);
  res.json({ log: updated });
});

export const removeWellnessLog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await getWellnessLogById(req.user.id, id);
  if (!existing) {
    return res.status(404).json({ message: "Wellness log not found" });
  }

  await deleteWellnessLog(req.user.id, id);
  res.status(204).send();
});

