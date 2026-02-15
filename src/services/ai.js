import { GoogleGenerativeAI } from "@google/generative-ai";

export const MODELS = [
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
  { id: "gemini-pro", name: "Gemini Pro" },
];

export async function generateCurriculum(modelId, learningObjective, apiKey) {
  const key = apiKey || localStorage.getItem('google_ai_api_key') || import.meta.env.VITE_GOOGLE_API_KEY;

  if (!key) {
    throw new Error("Google AI API Key is missing. Please enter it in the settings.");
  }

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: modelId });

  const prompt = `
You are a professional curriculum creator for AI Leaders (our workforce development course) who writes in plain, succinct language. The user will give you a learning objective. Respond by adding to that learning objective a Competency, Enduring Understanding, Essential Questions, "Assessment Project Check Bloom's & Webb's", Mastery Criteria / Success Metrics UDL Accommodations, and Activities that can be used in a lesson to meet that learning objective. 

**All activities must be focused on building a student's professional portfolio that they will use to get jobs.**

Do not give any other information than that. Write response as a CSV row for a CSV with the columns: Learning Objective Competency, Enduring Understanding, Essential Questions, "Assessment Project Check Bloom's & Webb's", Mastery Criteria / Success Metrics UDL Accommodations, and Activities

Learning Objective: ${learningObjective}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.trim();
  } catch (error) {
    console.error("Error generating curriculum:", error);
    throw error;
  }
}
