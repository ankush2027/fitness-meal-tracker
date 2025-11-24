import { validationResult } from "express-validator";
import {
  createWaterLog,
  deleteWaterLog,
  getTodayWaterTotal,
  getWaterLogById,
  getWaterLogsByUser,
  updateWaterLog,
} from "../models/waterModel.js";
import asyncHandler from "../utils/asyncHandler.js";

export const listWaterLogs = asyncHandler(async (req, res) => {
  const logs = await getWaterLogsByUser(req.user.id);
  const todayTotal = await getTodayWaterTotal(req.user.id);
  res.json({ logs, todayTotal });
});

export const addWaterLog = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const payload = {
    ...req.body,
    logged_at: req.body.logged_at || new Date().toISOString(),
  };
  const log = await createWaterLog(req.user.id, payload);
  res.status(201).json({ log });
});

export const editWaterLog = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const { id } = req.params;
  const existing = await getWaterLogById(req.user.id, id);
  if (!existing) {
    return res.status(404).json({ message: "Water log not found" });
  }

  const updated = await updateWaterLog(req.user.id, id, {
    ...req.body,
    logged_at: req.body.logged_at || existing.logged_at,
  });
  res.json({ log: updated });
});

export const removeWaterLog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await getWaterLogById(req.user.id, id);
  if (!existing) {
    return res.status(404).json({ message: "Water log not found" });
  }

  await deleteWaterLog(req.user.id, id);
  res.status(204).send();
});

