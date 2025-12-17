import { GoogleGenAI } from "@google/genai";
import { BookmarkFormData } from "../types";

// Initialize Gemini Client
// Note: API key is injected via environment variable as per requirements
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeUrlWithGemini = async (url: string): Promise<Partial<BookmarkFormData>> => {
  try {
    const modelId = 'gemini-2.5-flash';
    
    const prompt = `
      You are an intelligent bookmark assistant. 
      Analyze the following URL: ${url}.
      
      Your task is to:
      1. Identify the likely Title of the page.
      2. Write a short description of what the page is about.
      3. Generate a comprehensive summary in Traditional Chinese (繁體中文), between 100-150 words.
      4. Extract 3 to 5 key points (bullet points) in Traditional Chinese.
      5. Suggest a single short category name (e.g., Technology, Cooking, News).

      If you cannot access the page directly, use your search tool to find information about this specific URL.

      Return the result STRICTLY as a raw JSON object. Do not include markdown formatting (like \`\`\`json).
      The JSON structure must be:
      {
        "title": "string",
        "description": "string",
        "ai_summary": "string",
        "ai_key_points": ["string", "string", ...],
        "ai_category": "string"
      }
    `;

    // We use the googleSearch tool to help Gemini understand the content of the URL 
    // if it hasn't indexed it recently.
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType and responseSchema are NOT allowed when using googleSearch tool
        // so we must parse the text manually.
      }
    });

    const text = response.text || "";
    
    // Attempt to clean and parse JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      const data = JSON.parse(jsonStr);
      return {
        title: data.title || url,
        description: data.description || "No description available",
        ai_summary: data.ai_summary || "Could not generate summary.",
        ai_key_points: Array.isArray(data.ai_key_points) ? data.ai_key_points : [],
        ai_category: data.ai_category || "Uncategorized",
        url: url
      };
    } else {
      throw new Error("Failed to parse AI response as JSON");
    }

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback if AI fails
    return {
      title: url,
      description: "Analysis failed. Please fill manually.",
      ai_summary: "AI could not summarize this link.",
      ai_key_points: [],
      ai_category: "Unknown",
      url: url
    };
  }
};