// Common foods dictionary with nutrition values
// Nutrition is based on standard serving sizes or per 100g/100ml.
// serving_type helps scaling:
// - 'count': quantity acts as a direct multiplier (e.g. 2 banana = 2 * base)
// - 'ml': quantity scale factor is ml / 100 (e.g. 500 ml = 5 * base_per_100ml)
// - 'g': quantity scale factor is grams / 100 (e.g. 250 g = 2.5 * base_per_100g)
// - 'cup': quantity acts as direct multiplier (e.g. 1 cup = 1 * base)
// - 'plate': quantity acts as direct multiplier (e.g. 1 plate = 1 * base)

export const commonFoods = {
  banana: {
    name: "Banana",
    serving_type: "count",
    calories: 105,
    protein: 1.3,
    carbs: 27.0,
    fats: 0.4,
    fiber: 3.1
  },
  egg: {
    name: "Egg",
    serving_type: "count",
    calories: 70,
    protein: 6.0,
    carbs: 0.6,
    fats: 5.0,
    fiber: 0.0
  },
  milk: {
    name: "Milk",
    serving_type: "ml", // values are per 100ml
    calories: 60,
    protein: 3.2,
    carbs: 4.8,
    fats: 3.25,
    fiber: 0.0
  },
  apple: {
    name: "Apple",
    serving_type: "count",
    calories: 95,
    protein: 0.5,
    carbs: 25.0,
    fats: 0.3,
    fiber: 4.4
  },
  chapati: {
    name: "Chapati",
    serving_type: "count",
    calories: 70,
    protein: 2.6,
    carbs: 15.0,
    fats: 0.4,
    fiber: 2.0
  },
  roti: {
    name: "Roti",
    serving_type: "count",
    calories: 70,
    protein: 2.6,
    carbs: 15.0,
    fats: 0.4,
    fiber: 2.0
  },
  "rice roti": {
    name: "Rice Roti (Akki Rotti)",
    serving_type: "count",
    calories: 130,
    protein: 3.0,
    carbs: 28.0,
    fats: 1.0,
    fiber: 1.5
  },

  rice: {
    name: "Rice (Cooked)",
    serving_type: "cup",
    calories: 200,
    protein: 4.0,
    carbs: 44.0,
    fats: 0.4,
    fiber: 1.0
  },
  tea: {
    name: "Tea",
    serving_type: "cup",
    calories: 20,
    protein: 1.0,
    carbs: 3.0,
    fats: 0.5,
    fiber: 0.0
  },
  chai: {
    name: "Chai",
    serving_type: "cup",
    calories: 25,
    protein: 1.2,
    carbs: 4.0,
    fats: 0.6,
    fiber: 0.0
  },
  "neer dosa": {
    name: "Neer Dosa",
    serving_type: "count",
    calories: 60,
    protein: 1.0,
    carbs: 12.0,
    fats: 0.5,
    fiber: 0.5
  },
  dosa: {
    name: "Dosa",
    serving_type: "count",
    calories: 120,
    protein: 2.0,
    carbs: 25.0,
    fats: 1.5,
    fiber: 1.0
  },
  idli: {
    name: "Idli",
    serving_type: "count",
    calories: 40,
    protein: 1.0,
    carbs: 8.0,
    fats: 0.1,
    fiber: 0.5
  },
  "chicken biryani": {
    name: "Chicken Biryani",
    serving_type: "plate",
    calories: 450,
    protein: 25.0,
    carbs: 55.0,
    fats: 15.0,
    fiber: 3.0
  },
  biryani: {
    name: "Biryani",
    serving_type: "plate",
    calories: 450,
    protein: 22.0,
    carbs: 58.0,
    fats: 14.0,
    fiber: 3.0
  },
  "chicken pasta": {
    name: "Chicken Pasta",
    serving_type: "cup", // can treat as cup/bowl multiplier
    calories: 350,
    protein: 20.0,
    carbs: 45.0,
    fats: 10.0,
    fiber: 2.0
  },
  salad: {
    name: "Salad",
    serving_type: "cup",
    calories: 100,
    protein: 2.0,
    carbs: 10.0,
    fats: 5.0,
    fiber: 3.0
  },
  sandwich: {
    name: "Sandwich",
    serving_type: "count",
    calories: 250,
    protein: 10.0,
    carbs: 30.0,
    fats: 8.0,
    fiber: 2.0
  },
  oatmeal: {
    name: "Oatmeal",
    serving_type: "cup",
    calories: 150,
    protein: 6.0,
    carbs: 27.0,
    fats: 3.0,
    fiber: 4.0
  },
  yogurt: {
    name: "Yogurt",
    serving_type: "cup",
    calories: 120,
    protein: 10.0,
    carbs: 12.0,
    fats: 3.0,
    fiber: 0.0
  },
  coffee: {
    name: "Coffee",
    serving_type: "cup",
    calories: 5,
    protein: 0.3,
    carbs: 0.0,
    fats: 0.0,
    fiber: 0.0
  },
  "orange juice": {
    name: "Orange Juice",
    serving_type: "ml", // per 100ml
    calories: 45,
    protein: 0.8,
    carbs: 10.4,
    fats: 0.2,
    fiber: 0.2
  }
};

// Normalize names to handle plurals
export const normalizeFoodName = (name) => {
  let cleaned = name.trim().toLowerCase();
  
  // Standardize rotti spelling to roti
  cleaned = cleaned.replace(/rotti/g, "roti");
  
  // Hand-rolled mapping for common words
  if (cleaned === "bananas") return "banana";
  if (cleaned === "eggs") return "egg";
  if (cleaned === "apples") return "apple";
  if (cleaned === "chapatis" || cleaned === "chapaties") return "chapati";
  if (cleaned === "rotis" || cleaned === "roties") return "roti";
  if (cleaned === "neer dosas") return "neer dosa";
  if (cleaned === "dosas") return "dosa";
  if (cleaned === "idlis" || cleaned === "idlies") return "idli";
  if (cleaned === "sandwiches") return "sandwich";

  
  // Standard plural ending in s (avoid words like glass, oats, rice, etc.)
  if (cleaned.endsWith('s') && !['glass', 'oats', 'rice', 'couscous', 'hummus'].includes(cleaned)) {
    return cleaned.slice(0, -1);
  }
  
  return cleaned;
};
