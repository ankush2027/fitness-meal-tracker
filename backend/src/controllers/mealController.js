import { validationResult } from "express-validator";
import {
  createMeal,
  deleteMeal,
  getMealById,
  getMealsByUser,
  updateMeal,
} from "../models/mealModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import { parseLocalMealText } from "../utils/localParser.js";
import { getFoodNutrition, scaleNutrition, parseQuantityString } from "../utils/nutritionService.js";
import { extractFoodsWithAI } from "../utils/aiService.js";

import db from "../config/db.js";

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

export const analyzeAndSaveMeal = asyncHandler(async (req, res) => {
  const { query, meal_type, meal_date, clarifications } = req.body;

  if (!query || typeof query !== "string" || !query.trim()) {
    return res.status(400).json({ message: "Meal query text is required" });
  }

  const mType = meal_type || "snack";
  const mDate = meal_date || new Date().toISOString().slice(0, 10);

  // If clarifications are provided, pre-insert them into the database cache!
  if (clarifications && Array.isArray(clarifications)) {
    for (const c of clarifications) {
      if (c.name) {
        try {
          const normalizedCacheName = c.name.trim().toLowerCase();
          await db.query(
            `INSERT INTO food_cache (food_name, calories, protein, carbs, fats, fiber)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             calories = VALUES(calories),
             protein = VALUES(protein),
             carbs = VALUES(carbs),
             fats = VALUES(fats),
             fiber = VALUES(fiber)`,
            [
              normalizedCacheName,
              Math.round(c.calories || 0),
              parseFloat(c.protein || 0),
              parseFloat(c.carbs || 0),
              parseFloat(c.fats || 0),
              parseFloat(c.fiber || 0)
            ]
          );
          console.log(`Saved user clarified food "${normalizedCacheName}" to cache.`);
        } catch (dbErr) {
          console.error("Error saving clarification to cache:", dbErr);
        }
      }
    }
  }

  let foodsList = null;
  let aiUsed = false;


  // 1. Try local parser first
  try {
    const localParsed = parseLocalMealText(query);
    if (localParsed && localParsed.foods && localParsed.foods.length > 0) {
      // Check if we can find nutrition for all locally parsed items
      const resolvedFoods = [];
      let allFound = true;
      for (const food of localParsed.foods) {
        const nutData = await getFoodNutrition(food.name);
        if (nutData) {
          resolvedFoods.push({
            ...food,
            nutritionData: nutData
          });
        } else {
          allFound = false;
          break;
        }
      }
      if (allFound) {
        foodsList = resolvedFoods;
        console.log(`✅ Local parser succeeded for query: "${query}"`);
      }
    }
  } catch (localError) {
    console.error("Local parsing or lookup failed, falling back to Gemini:", localError);
  }

  // 2. Fallback to Gemini if local parsing or lookup was unsuccessful
  if (!foodsList) {
    aiUsed = true;
    try {
      console.log(`Local parsing/lookup failed for query: "${query}". Calling Gemini AI...`);
      const aiParsed = await extractFoodsWithAI(query);
      if (aiParsed && aiParsed.foods && aiParsed.foods.length > 0) {
        const resolvedFoods = [];
        for (const food of aiParsed.foods) {
          const nutData = await getFoodNutrition(food.name);
          resolvedFoods.push({
            ...food,
            nutritionData: nutData // might be null, handled below
          });
        }
        foodsList = resolvedFoods;
      } else {
        return res.status(400).json({ message: "Could not identify any food items in your description." });
      }
    } catch (aiError) {
      console.error("Gemini AI analysis failed:", aiError);
      return res.status(500).json({ message: `Failed to analyze meal: ${aiError.message}` });
    }
  }

  if (!foodsList || foodsList.length === 0) {
    return res.status(400).json({ message: "No food items could be identified or analyzed." });
  }

  // 3. Scale and aggregate nutrition values
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;
  let totalFiber = 0;

  const detailedFoods = [];

  for (const item of foodsList) {
    const qtyObj = parseQuantityString(item.quantity);
    let scaled = { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 };

    if (item.nutritionData) {
      scaled = scaleNutrition(qtyObj, item.nutritionData);
    }

    totalCalories += scaled.calories;
    totalProtein += scaled.protein;
    totalCarbs += scaled.carbs;
    totalFats += scaled.fats;
    totalFiber += scaled.fiber;

    detailedFoods.push({
      name: item.name,
      quantity: item.quantity,
      nutrition: scaled,
      found: !!item.nutritionData
    });
  }

  // Check if there are unrecognized foods
  const unrecognizedFoods = detailedFoods.filter(f => !f.found);
  if (unrecognizedFoods.length > 0) {
    return res.status(200).json({
      success: false,
      needs_clarification: true,
      unrecognized: unrecognizedFoods.map(f => f.name),
      foods: detailedFoods,
      query,
      meal_type: mType,
      meal_date: mDate
    });
  }

  // 4. Save to meals table
  const foodNamesSummary = foodsList.map(f => `${f.quantity} ${f.name}`).join(", ");
  const mealName = foodNamesSummary.length <= 150 ? foodNamesSummary : query.slice(0, 150);

  const newMeal = {
    meal_name: mealName,
    meal_type: mType,
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein),
    carbs: Math.round(totalCarbs),
    fats: Math.round(totalFats),
    fiber: Math.round(totalFiber),
    meal_date: mDate
  };

  let savedMeal;
  if (req.body.id) {
    const existing = await getMealById(req.user.id, req.body.id);
    if (!existing) {
      return res.status(404).json({ message: "Meal not found" });
    }
    savedMeal = await updateMeal(req.user.id, req.body.id, newMeal);
  } else {
    savedMeal = await createMeal(req.user.id, newMeal);
  }

  res.status(req.body.id ? 200 : 201).json({
    message: "Meal successfully saved",
    meal: savedMeal,
    ai_used: aiUsed,
    foods: detailedFoods
  });
});


