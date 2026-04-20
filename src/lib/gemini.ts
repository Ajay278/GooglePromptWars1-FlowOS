import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Smart Insight Engine
 * Leverages Google Gemini to analyze stadium status and provide fan guidance.
 */
export async function getStadiumInsight(weather: string, eventStatus: string, congestionLevel: string) {
  if (!genAI) {
    return "Stay hydrated and follow the signs for a smooth experience!";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are the FlowOS Smart Stadium Assistant. 
    Context: Weather is ${weather}, Event Status is ${eventStatus}, Overall Congestion is ${congestionLevel}.
    Provide a one-sentence, highly encouraging, and helpful tip for a fan currently at the stadium. 
    Focus on safety, comfort, or navigation. Be concise.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (e) {
    console.error("Gemini Insight Error:", e);
    return "Welcome to Flow Stadium! We're glad to have you here.";
  }
}
