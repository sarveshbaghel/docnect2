
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const summarizeDocument = async (fileName: string, subject: string, type: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an academic assistant. Generate a short (2-sentence) professional summary for an academic document named "${fileName}" related to the subject "${subject}" of type "${type}". If it sounds like a real academic topic, provide helpful context.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    });
    return response.text?.trim() || "No summary available.";
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "AI summarization failed, but the document is uploaded.";
  }
};
