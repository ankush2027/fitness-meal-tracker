import { normalizeFoodName } from "./commonFoods.js";

const textNumbers = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10, half: 0.5
};

const UNITS = ['ml', 'g', 'grams', 'cup', 'cups', 'plate', 'plates', 'slice', 'slices', 'glass', 'glasses', 'bowl', 'bowls'];

function parseSingleItem(text) {
  text = text.trim().toLowerCase();
  if (!text) return null;

  // Clean common introductory filler words
  text = text.replace(/^(i\s+)?(had|ate|drank|consumed|took)\s+(a|an)?\s*/i, "");
  text = text.replace(/^of\s+/i, ""); // strip leading "of"

  const numRegexStr = `(\\d+(?:\\.\\d+)?|\\d+\\/\\d+|one|two|three|four|five|six|seven|eight|nine|ten|half|a|an)`;
  const unitRegexStr = `(${UNITS.join('|')})`;

  // Pattern 1: [quantity] [unit] [of] [food] e.g. "500 ml milk", "1 cup rice", "one cup of tea", "half plate rice"
  const pattern1 = new RegExp(`^${numRegexStr}\\s+${unitRegexStr}\\s+(?:of\\s+)?(.+)$`, 'i');
  let match = text.match(pattern1);
  if (match) {
    let qVal = match[1];
    let unitVal = match[2];
    let foodVal = normalizeFoodName(match[3]);
    return { name: foodVal, quantity: `${qVal} ${unitVal}` };
  }

  // Pattern 2: [quantity] [food] e.g. "2 bananas", "one apple", "3 eggs"
  const pattern2 = new RegExp(`^${numRegexStr}\\s+(.+)$`, 'i');
  match = text.match(pattern2);
  if (match) {
    let qVal = match[1];
    let foodVal = normalizeFoodName(match[2]);
    return { name: foodVal, quantity: qVal };
  }

  // Pattern 3: Just food name with no quantity (we assume quantity = 1 or "1 serving")
  // To avoid parsing complex clauses as single foods, restrict to max 3 words and letters/spaces only
  const isSimpleName = /^[a-z0-9\s]+$/i.test(text) && text.split(/\s+/).length <= 3;
  if (isSimpleName) {
    let foodVal = normalizeFoodName(text);
    return { name: foodVal, quantity: 1 };
  }

  return null;
}

export const parseLocalMealText = (query) => {
  if (!query || typeof query !== 'string') return null;

  // Split by "and", "with", or commas
  const parts = query.split(/\b(?:and|with)\b|,\s*/i).map(p => p.trim()).filter(Boolean);
  if (parts.length === 0) return null;

  const foods = [];
  for (const part of parts) {
    const parsed = parseSingleItem(part);
    if (!parsed) {
      // If any part fails to parse, the whole local parser fails
      return null;
    }
    foods.push(parsed);
  }

  return { foods };
};
