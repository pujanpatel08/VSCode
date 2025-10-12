import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getActivitySuggestions(interests) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  You are an AI travel concierge for Marriott Hotels.
  Suggest 5 unique Marriott experiences, amenities, or local activities that align with these user interests:
  ${interests.join(", ")}.
  Focus on personalized, human-centered travel experiences that foster connection and belonging.
  Return your answer as a simple numbered list.
  `;

  const result = await model.generateContent(prompt);
  const text = await result.response.text();
  return text;
}
