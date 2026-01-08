
import { GoogleGenAI } from "@google/genai";

export const getAIExplanation = async (topic: string, context: string) => {
  if (!process.env.API_KEY) return "AI Assistant is currently unavailable (No API Key).";

  // Create a new GoogleGenAI instance for every call to ensure the latest key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain the following topic: "${topic}" within the context of this project: "${context}".`,
      config: {
        systemInstruction: "You are a STEM Academy educational assistant. Keep your explanations professional, encouraging, and easy for students to understand.",
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "I couldn't generate an explanation at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while communicating with the AI assistant.";
  }
};
