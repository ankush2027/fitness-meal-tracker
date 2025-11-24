import { validationResult } from "express-validator";
import {
  createBodyMetric,
  deleteBodyMetric,
  getBodyMetricById,
  getBodyMetricsByUser,
  updateBodyMetric,
} from "../models/bodyMetricModel.js";
import asyncHandler from "../utils/asyncHandler.js";

export const listBodyMetrics = asyncHandler(async (req, res) => {
  const metrics = await getBodyMetricsByUser(req.user.id);
  res.json({ metrics });
});

export const addBodyMetric = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const metric = await createBodyMetric(req.user.id, req.body);
  res.status(201).json({ metric });
});

export const editBodyMetric = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const existing = await getBodyMetricById(req.user.id, id);
  if (!existing) {
    return res.status(404).json({ message: "Body metric entry not found" });
  }

  const updated = await updateBodyMetric(req.user.id, id, req.body);
  res.json({ metric: updated });
});

export const removeBodyMetric = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await getBodyMetricById(req.user.id, id);
  if (!existing) {
    return res.status(404).json({ message: "Body metric entry not found" });
  }

  await deleteBodyMetric(req.user.id, id);
  res.status(204).send();
});

