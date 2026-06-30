import db from "../config/db.js";
import { commonFoods, normalizeFoodName } from "./commonFoods.js";

// Average weights in grams for single units of common count-based foods
const averageUnitWeights = {
  peanut: 1.0,
  almond: 1.2,
  cashew: 1.5,
  walnut: 4.0,
  pistachio: 0.7,
  grape: 5.0,
  strawberry: 12.0,
  blueberry: 0.7,
  olive: 4.0,
  cherry: 5.0,
  date: 8.0,
  fig: 50.0,
  apricot: 35.0,
  cookie: 15.0,
  chip: 2.0,
  biscuit: 10.0,
  sweet: 20.0,
  chocolate: 5.0,
  clove: 0.5,
  cardamom: 0.2,
  carrot: 60.0,
  potato: 150.0,
  onion: 100.0,
  tomato: 100.0,
  cucumber: 200.0,
  "sweet potato": 130.0,
  "chicken breast": 170.0,
};

// Helper to scale nutrition for a given quantity object and food data
export const scaleNutrition = (qtyObj, foodData) => {
  const { value, unit } = qtyObj;
  let factor = 1;

  if (foodData.serving_type === 'count') {
    if (unit === 'g' || unit === 'grams') {
      factor = value / 100; // if user specifies weight instead of count
    } else {
      factor = value;
    }
  } else if (foodData.serving_type === 'ml') {
    if (unit === 'ml') {
      factor = value / 100;
    } else if (unit === 'glass' || unit === 'cup' || unit === 'cups' || unit === 'glasses') {
      factor = (value * 250) / 100;
    } else if (unit === 'spoon' || unit === 'spoons' || unit === 'tbsp') {
      factor = (value * 15) / 100;
    } else if (unit === 'tsp') {
      factor = (value * 5) / 100;
    } else {
      factor = value * 2.5; // default 250ml per cup/glass
    }
  } else if (foodData.serving_type === 'cup') {
    if (unit === 'cup' || unit === 'cups') {
      factor = value;
    } else if (unit === 'bowl' || unit === 'bowls') {
      factor = value * 1.5;
    } else if (unit === 'spoon' || unit === 'spoons' || unit === 'tbsp') {
      factor = value * 0.08; // ~12 tbsp per cup
    } else if (unit === 'tsp') {
      factor = value * 0.02;
    } else {
      factor = value;
    }
  } else if (foodData.serving_type === 'plate') {
    if (unit === 'plate' || unit === 'plates') {
      factor = value;
    } else if (unit === 'half') {
      factor = value * 0.5;
    } else if (unit === 'bowl' || unit === 'bowls') {
      factor = value * 0.75;
    } else {
      factor = value;
    }
  } else {
    // Generic fallback (values are per 100g)
    const servingWeight = foodData.servingWeight || 100;
    const u = String(unit).toLowerCase();
    
    if (u === 'g' || u === 'grams' || u === 'gram' || u === 'grm' || u === 'grms') {
      factor = value / 100;
    } else if (u === 'ml') {
      factor = value / 100;
    } else if (u === 'cup' || u === 'cups') {
      factor = (value * 200) / 100;
    } else if (u === 'slice' || u === 'slices') {
      factor = (value * 30) / 100;
    } else if (u === 'glass' || u === 'glasses') {
      factor = (value * 250) / 100;
    } else if (u === 'bowl' || u === 'bowls') {
      factor = (value * 300) / 100;
    } else if (u === 'plate' || u === 'plates') {
      factor = (value * 400) / 100;
    } else if (u === 'handful' || u === 'handfuls') {
      factor = (value * 30) / 100;
    } else if (u === 'spoon' || u === 'spoons' || u === 'tbsp') {
      factor = (value * 15) / 100;
    } else if (u === 'tsp') {
      factor = (value * 5) / 100;
    } else if (u === 'oz' || u === 'ounce' || u === 'ounces') {
      factor = (value * 28.35) / 100;
    } else if (u === 'count' || u === 'serving' || u === 'servings') {
      // If the unit is count/serving, check if we have a known unit weight for this food name
      const normName = normalizeFoodName(foodData.name);
      if (averageUnitWeights[normName]) {
        factor = (value * averageUnitWeights[normName]) / 100;
      } else {
        factor = (value * servingWeight) / 100;
      }
    } else {
      factor = (value * servingWeight) / 100;
    }
  }

  const base = {
    calories: foodData.caloriesPer100g !== undefined ? foodData.caloriesPer100g : foodData.calories || 0,
    protein: foodData.proteinPer100g !== undefined ? foodData.proteinPer100g : foodData.protein || 0,
    carbs: foodData.carbsPer100g !== undefined ? foodData.carbsPer100g : foodData.carbs || 0,
    fats: foodData.fatsPer100g !== undefined ? foodData.fatsPer100g : foodData.fats || 0,
    fiber: foodData.fiberPer100g !== undefined ? foodData.fiberPer100g : foodData.fiber || 0
  };

  return {
    calories: Math.round(base.calories * factor),
    protein: Math.round(base.protein * factor),
    carbs: Math.round(base.carbs * factor),
    fats: Math.round(base.fats * factor),
    fiber: Math.round(base.fiber * factor)
  };
};

export const parseQuantityString = (qty) => {
  if (qty === undefined || qty === null) return { value: 1, unit: 'serving' };
  
  const textNumbers = {
    a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10, half: 0.5
  };

  const qtyStr = String(qty).trim().toLowerCase();
  
  // Try to match [number/word] [unit]
  const numUnitMatch = qtyStr.match(/^(\d+(?:\.\d+)?|\d+\/\d+|one|two|three|four|five|six|seven|eight|nine|ten|half|a|an)\s+(ml|g|grams|gram|grm|grms|cup|cups|plate|plates|slice|slices|glass|glasses|bowl|bowls|handful|handfuls|spoon|spoons|tbsp|tsp|oz|ounce|ounces|pack|package|serving|servings)$/i);
  if (numUnitMatch) {
    let rawNum = numUnitMatch[1];
    let unit = numUnitMatch[2];
    
    let value = parseFloat(rawNum);
    if (isNaN(value)) {
      if (rawNum.includes('/')) {
        const parts = rawNum.split('/');
        value = parseFloat(parts[0]) / parseFloat(parts[1]);
      } else {
        value = textNumbers[rawNum] || 1;
      }
    }
    return { value, unit };
  }

  // Match just number or word
  const numMatch = qtyStr.match(/^(\d+(?:\.\d+)?|\d+\/\d+|one|two|three|four|five|six|seven|eight|nine|ten|half|a|an)$/i);
  if (numMatch) {
    let rawNum = numMatch[1];
    let value = parseFloat(rawNum);
    if (isNaN(value)) {
      if (rawNum.includes('/')) {
        const parts = rawNum.split('/');
        value = parseFloat(parts[0]) / parseFloat(parts[1]);
      } else {
        value = textNumbers[rawNum] || 1;
      }
    }
    return { value, unit: 'count' };
  }

  return { value: 1, unit: 'serving' };
};

// Search Open Food Facts
const searchOpenFoodFacts = async (foodName) => {
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(foodName)}&search_simple=1&action=process&json=1&page_size=5`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FitnessMealTracker - Node.js Backend'
      }
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.products || data.products.length === 0) return null;

    // Find the first product that has energy-kcal data
    const product = data.products.find(p => p.nutriments && (p.nutriments['energy-kcal_100g'] || p.nutriments['energy_100g']));
    if (!product) return null;

    const nutriments = product.nutriments;
    const calories = nutriments['energy-kcal_100g'] || (nutriments['energy_100g'] ? Math.round(nutriments['energy_100g'] / 4.184) : 0);
    const protein = nutriments['proteins_100g'] || 0;
    const carbs = nutriments['carbohydrates_100g'] || 0;
    const fats = nutriments['fat_100g'] || 0;
    const fiber = nutriments['fiber_100g'] || 0;
    const servingWeight = parseFloat(product.serving_quantity) || 100;

    return {
      name: product.product_name || foodName,
      calories: Math.round(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fats: parseFloat(fats),
      fiber: parseFloat(fiber),
      servingWeight: servingWeight
    };
  } catch (error) {
    console.error("Open Food Facts search failed:", error);
    return null;
  }
};

// Get nutrition data for a single food item
export const getFoodNutrition = async (rawName) => {
  const normalized = normalizeFoodName(rawName);

  // 1. Check local common foods dictionary
  if (commonFoods[normalized]) {
    return { source: 'local_dictionary', ...commonFoods[normalized] };
  }

  // 2. Check local database cache
  try {
    const [rows] = await db.query(
      "SELECT * FROM food_cache WHERE food_name = ?",
      [normalized]
    );
    if (rows.length > 0) {
      const cached = rows[0];
      return {
        source: 'database_cache',
        name: cached.food_name,
        caloriesPer100g: cached.calories,
        proteinPer100g: Number(cached.protein),
        carbsPer100g: Number(cached.carbs),
        fatsPer100g: Number(cached.fats),
        fiberPer100g: Number(cached.fiber),
        servingWeight: 100 // assume 100g reference in cache
      };
    }
  } catch (error) {
    console.error("Failed to query food_cache table:", error);
  }

  // 3. Query Open Food Facts
  const offData = await searchOpenFoodFacts(normalized);
  if (offData) {
    // Save to food_cache so subsequent lookups are fast
    try {
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
          normalized,
          offData.calories,
          offData.protein,
          offData.carbs,
          offData.fats,
          offData.fiber
        ]
      );
    } catch (cacheError) {
      console.error("Failed to save food to food_cache table:", cacheError);
    }

    return {
      source: 'open_food_facts',
      name: offData.name,
      caloriesPer100g: offData.calories,
      proteinPer100g: offData.protein,
      carbsPer100g: offData.carbs,
      fatsPer100g: offData.fats,
      fiberPer100g: offData.fiber,
      servingWeight: offData.servingWeight
    };
  }

  // 3.5 Fallback: Fuzzy matching against local commonFoods key/names
  const commonKeys = Object.keys(commonFoods);
  const matchedKey = commonKeys.find(key => {
    // Exact or substring match (e.g. "rice roti" contains "roti" or matches end of it)
    if (normalized.endsWith(key) || key.endsWith(normalized)) return true;
    // Word-based match (e.g. "vegetable salad" matches "salad")
    const words = normalized.split(/\s+/);
    if (words.includes(key)) return true;
    return false;
  });
  if (matchedKey) {
    console.log(`Fuzzy matched "${normalized}" to common food "${matchedKey}"`);
    return { source: 'local_dictionary_fuzzy', ...commonFoods[matchedKey] };
  }

  // 4. Default fallback if not found anywhere (we should return null)
  return null;
};

