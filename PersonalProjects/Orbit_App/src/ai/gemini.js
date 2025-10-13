import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
console.log("Gemini API Key loaded:", apiKey);

if (!apiKey) {
  console.error("❌ Missing Gemini API key. Check your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function getActivitySuggestions(interests, destination) {
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    const prompt = `
      You are an AI concierge for Marriott International.
      The traveler’s destination is **${destination}**.
      Their group’s interests are: **${interests.join(", ")}**.

      Using only *real Marriott Bonvoy experiences, amenities, or partnerships* that actually exist
      (like those found on Marriott Bonvoy Experiences or official Marriott hotel offerings),
      suggest 5 activities relevant to ${destination}.
      
      Prioritize these Marriott brands if possible:
      - The Ritz-Carlton (luxury, spa, dining, local culture)
      - JW Marriott (wellness, sustainability, culinary)
      - W Hotels (music, nightlife, social experiences)
      - Moxy (young travelers, social and bar-focused)
      - Westin (well-being and fitness)
      - St. Regis (fine dining and heritage travel)
      - Marriott Vacation Club or Bonvoy Tours (local excursions)

      For each recommendation, include:
      1. The **Marriott property or brand name** (if known)
      2. The **activity title**
      3. A **one-sentence description** that feels authentic and useful.

      Example output:
      1. **The Ritz-Carlton, Kyoto – Traditional Tea Ceremony**: Experience Kyoto’s tea culture with a private ceremony hosted by local masters.
      2. **W Barcelona – Sunset DJ Sessions**: Sip cocktails while watching the Mediterranean sunset from W’s iconic rooftop bar.
      3. **JW Marriott Venice – Garden Cooking Class**: Learn Italian farm-to-table cuisine using ingredients grown on the hotel’s private island.

      Keep results factual, location-relevant, and concise.
      Avoid made-up hotel names.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Could not fetch real Marriott activities. Please check your API key or connection.";
  }
}



async function listAvailableModels() {
  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1/models?key=" + apiKey
    );
    const data = await res.json();
    console.log("✅ Available models for this key:", data.models?.map(m => m.name));
  } catch (err) {
    console.error("❌ Model listing failed:", err);
  }
}

listAvailableModels();

