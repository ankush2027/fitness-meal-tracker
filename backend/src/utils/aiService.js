import dotenv from "dotenv";
dotenv.config();

/**
 * Call Gemini API to extract food items and their quantities from a complex sentence.
 * Returns structured JSON: { foods: [ { name: "banana", quantity: 2 } ] }
 */
export const extractFoodsWithAI = async (query) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured. Please add your Gemini API Key in the backend .env file.");
  }

  const prompt = `Analyze the following meal description and extract all food items and their quantities.
Return a valid JSON object matching this schema:
{
  "foods": [
    {
      "name": "food name",
      "quantity": "quantity (number or description like '2' or '500 ml' or '1 cup')"
    }
  ]
}
Return ONLY the raw JSON object. Do NOT wrap it in markdown code blocks like \`\`\`json. Do NOT include any explanations or calories.

Meal description: "${query}"`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errText}`);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Invalid response structure received from Gemini API");
  }

  try {
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (err) {
    console.error("Failed to parse Gemini response as JSON. Raw text:", text);
    throw new Error("Gemini response is not valid JSON");
  }
};
