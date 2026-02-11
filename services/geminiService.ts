
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, EvaluationStatus } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeDataReasoning = async (data: string, assumptions: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    As a Data Reasoning Assistant, evaluate the following assumptions against the provided dataset.
    
    RULES:
    1. Do not invent data. 
    2. If data is insufficient for an assumption, explicitly mark it as INSUFFICIENT_DATA.
    3. Separate facts (directly in data) from opinions/inferences.
    4. Be critical but neutral.
    5. Provide a clear decision-making recommendation.

    DATASET:
    ${data}

    ASSUMPTIONS TO EVALUATE:
    ${assumptions}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Executive summary of the reasoning process." },
            overallConfidence: { type: Type.NUMBER, description: "A score from 0 to 1 representing data completeness." },
            keyDecisionRecommendation: { type: Type.STRING, description: "Actionable advice based on the evaluation." },
            evaluations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  assumption: { type: Type.STRING },
                  status: { 
                    type: Type.STRING, 
                    enum: Object.values(EvaluationStatus) 
                  },
                  reasoning: { type: Type.STRING },
                  supportingFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
                  conflictingFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingDataPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["assumption", "status", "reasoning"]
              }
            }
          },
          required: ["summary", "evaluations", "overallConfidence", "keyDecisionRecommendation"]
        }
      }
    });

    const text = response.text.trim();
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze data reasoning. Please check your inputs and try again.");
  }
};

export const suggestAssumptions = async (data: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    Analyze the following dataset and suggest 3-5 critical, testable assumptions or hypotheses that a decision-maker should evaluate. 
    Focus on potential patterns, anomalies, risks, or growth opportunities.
    Output the suggestions as a simple JSON array of strings.

    DATASET:
    ${data}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text.trim();
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    throw new Error("Failed to generate suggestions. Please check your data.");
  }
};
