
import { GoogleGenAI } from "@google/genai";
import { BookmarkFormData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeUrlWithGemini = async (url: string): Promise<Partial<BookmarkFormData>> => {
  try {
    // Using recommended gemini-3-flash-preview for Basic Text Tasks
    const modelId = 'gemini-3-flash-preview';
    
    const prompt = `
      You are an intelligent bookmark assistant. 
      Analyze the following URL: ${url}.
      
      Your task is to:
      1. Identify the likely Title of the page.
      2. Write a short description of what the page is about.
      3. Generate a comprehensive summary in Traditional Chinese (繁體中文), between 100-150 words.
      4. Extract 3 to 5 key points in Traditional Chinese.
      5. Suggest a single short primary category (e.g., Technology, Design, Business).
      6. Suggest 3 to 5 relevant tags (e.g., React, AI, CSS, Product).

      Return the result STRICTLY as a raw JSON object. 
      The JSON structure must be:
      {
        "title": "string",
        "description": "string",
        "ai_summary": "string",
        "ai_key_points": ["string", "string", ...],
        "ai_category": "string",
        "ai_tags": ["string", "string", ...]
      }
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    // Directly access text property from GenerateContentResponse
    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return {
        ...data,
        url: url
      };
    } else {
      throw new Error("Failed to parse AI response");
    }

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      title: url,
      description: "Analysis failed.",
      ai_summary: "AI could not summarize this link.",
      ai_key_points: [],
      ai_category: "Unknown",
      ai_tags: ["Untagged"],
      url: url
    };
  }
};
