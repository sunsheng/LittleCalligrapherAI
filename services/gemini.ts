import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePracticeText = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a plain text string of 12 to 16 Chinese characters suitable for an elementary school student to practice handwriting based on the topic: "${topic}". 
      
      Rules:
      1. Return ONLY the Chinese characters.
      2. Do not include pinyin, English translations, numbers, or punctuation.
      3. The characters should form meaningful words or a simple sentence if possible.
      4. Avoid extremely complex or rare characters.`,
    });
    
    // Clean up response just in case
    const text = response.text?.replace(/[^\u4e00-\u9fa5]/g, '') || "";
    return text.slice(0, 24); // Limit length
  } catch (error) {
    console.error("Error generating text:", error);
    throw new Error("AI 生成失败，请检查网络或稍后重试。");
  }
};