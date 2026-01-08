
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Fixed: Initializing GoogleGenAI client inside the service function and using process.env.API_KEY directly.
export const getAIExplanation = async (topic: string, context: string) => {
  if (!process.env.API_KEY) return "AI Assistant is currently unavailable (No API Key).";

  // Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    // Fixed: Explicitly typed response as GenerateContentResponse following guidelines.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain the following topic: "${topic}" within the context of this project: "${context}".`,
      config: {
        // Use systemInstruction for defining the persona and general style.
        systemInstruction: "You are a STEM Academy educational assistant. Keep your explanations professional, encouraging, and easy for students to understand.",
        temperature: 0.7,
        topP: 0.95,
      }
    });
    // response.text is a property, not a method.
    return response.text || "I couldn't generate an explanation at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while communicating with the AI assistant.";
  }
};
