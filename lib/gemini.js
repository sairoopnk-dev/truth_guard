import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

// Use a placeholder if there is no API key during build time, 
// though we'll throw an error if trying to initialize at runtime without one.
const genAI = new GoogleGenerativeAI(apiKey || "placeholder-key");

/**
 * Returns a configured GenerativeModel instance for Gemini.
 * @param {string} modelName - The name of the model to use (default: gemini-1.5-flash)
 * @returns {import('@google/generative-ai').GenerativeModel}
 */
export const getGeminiModel = (modelName = "gemini-1.5-flash") => {
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is missing from environment variables.");
  }
  return genAI.getGenerativeModel({ model: modelName });
};
