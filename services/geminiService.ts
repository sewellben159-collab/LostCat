import { GoogleGenAI } from "@google/genai";
import { CatProfile } from "../types";

// Initialize Gemini Client
// @ts-ignore - process is defined in the build environment
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateOptimizedDescription = async (
  cat: Partial<CatProfile>
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const prompt = `
    I lost my cat and I need a short, urgent, but clear description for a "LOST CAT" poster.
    Here are the details:
    Name: ${cat.name}
    Breed: ${cat.breed}
    Color: ${cat.color}
    Distinctive features: ${cat.features?.join(', ')}
    Last seen: ${cat.lastSeenAddress} on ${cat.lastSeenDate}

    Write a 3-4 sentence paragraph that is emotional but informative. 
    Focus on visual identification and how to approach the cat (assume friendly unless features say otherwise).
    Do not include the phone number or owner name in the body text (those are separate fields).
    Keep it under 60 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Help us find our beloved cat.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate description via AI.");
  }
};