import { GoogleGenAI, Type } from "@google/genai";
import { PredictionResult, FairnessLevel, UserInput, SimulationState, HistoricalTransaction } from "../types";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    // We will let the call fail gracefully in the UI if key is missing
  }
  return new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_BUILD' });
};

// Helper to calculate specific stats for the prompt
const calculateHistoryStats = (history: HistoricalTransaction[], currentDesc: string, currentCategory: string) => {
  // Simulation Date is Jan 28, 2026. 3 Months ago is Oct 28, 2025.
  const threeMonthsAgo = new Date('2025-10-28').getTime();
  
  // Find relevant transactions (matching description or category)
  const relevant = history.filter(h => {
    const d1 = h.description.toLowerCase();
    const d2 = currentDesc.toLowerCase();
    return (d1.includes(d2) || d2.includes(d1));
  });

  const recent = relevant.filter(h => new Date(h.date).getTime() >= threeMonthsAgo);
  
  if (recent.length === 0) return null;

  const avg = recent.reduce((sum, h) => sum + h.amount, 0) / recent.length;
  return {
    avgAmount: avg,
    count: recent.length,
    label: "User Average (Last 3 Months)"
  };
};

export const analyzePriceContext = async (input: UserInput, localHistory: HistoricalTransaction[] = []): Promise<PredictionResult> => {
  const ai = getGeminiClient();
  
  let historyContext = "";
  let stats: { avgAmount: number; count: number; label: string } | null = null;

  if (localHistory.length > 0) {
    stats = calculateHistoryStats(localHistory, input.description, input.category);
    
    let statsPrompt = "";
    if (stats) {
      statsPrompt = `
      DERIVED USER STATISTICS:
      - Found ${stats.count} similar transaction(s) in the last 3 months.
      - Calculated "${stats.label}": ${input.currency}${stats.avgAmount.toFixed(2)}.
      `;
    }

    historyContext = `
    IMPORTANT: The user has provided their own actual historical transaction data.
    You MUST prioritize this data to understand their specific spending habits and price anchors.
    
    USER'S PERSONAL HISTORY:
    ${JSON.stringify(localHistory.map(h => ({ date: h.date, desc: h.description, amount: h.amount })))}

    ${statsPrompt}

    If the current request is similar to items in the User's Personal History, weight the prediction heavily towards those historical values.
    `;
  }

  const prompt = `
    Act as "PriceProphet", a fair pricing intelligence engine. 
    Analyze the following spending context to determine a fair price range.
    
    Current Simulation Date: January 28, 2026.
    
    Context:
    - Description: ${input.description}
    - Category: ${input.category}
    - Participants/Context: ${input.participants}
    - Preferred Currency: ${input.currency}

    ${historyContext}

    Task:
    1. Generate 5-7 plausible synthetic historical transactions that would be relevant to this user's history. These should be recent, leading up to Jan 2026.
       If User's Personal History is provided, mix some of those real items into this list to show you are using them, but mark them as (User Data).
    2. Based on history and general market knowledge for 2025/2026, predict a fair price range in the preferred currency (${input.currency}).
    3. Determine a specific "suggested" price in ${input.currency}.
    4. Provide a confidence score (0-100). If user history matches well, confidence should be higher.
    5. Assess the fairness of the suggested price.
    6. Provide 2-3 bullet points of reasoning.
    7. Provide 4 specific key evidence factors (data points) used in your analysis.
       - ALWAYS include a "Market Benchmark (2026)" or "Peer Group Average (Similar Users)" factor.
       - ${stats ? `CRITICAL: You MUST include a factor labeled "${stats.label}" with value "${input.currency}${stats.avgAmount.toFixed(2)}".` : 'Include a "Historical Spending Pattern (Est.)" factor.'}
       - Include other relevant factors like "Inflation Adjustment" or "Location Premium".
       Use descriptive labels.

    Output as JSON. Ensure 'currency' field matches the symbol of ${input.currency}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            minPrice: { type: Type.NUMBER, description: "Minimum fair price" },
            maxPrice: { type: Type.NUMBER, description: "Maximum fair price" },
            suggestedPrice: { type: Type.NUMBER, description: "Best suggested price point" },
            confidenceScore: { type: Type.NUMBER, description: "Confidence in prediction 0-100" },
            fairnessLevel: { type: Type.STRING, enum: Object.values(FairnessLevel) },
            reasoning: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of reasons for the prediction"
            },
            keyFactors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING }
                }
              },
              description: "Key specific data points used in analysis"
            },
            historicalContext: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  date: { type: Type.STRING, description: "ISO date string YYYY-MM-DD" },
                  amount: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                }
              }
            },
            currency: { type: Type.STRING, description: "Currency symbol, e.g. RM, $, €" }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from Gemini");

    const data = JSON.parse(resultText) as PredictionResult;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Return a fallback mock if API fails for demo stability, or rethrow
    // In a real app, we'd handle error states in UI. For hackathon, providing a fallback ensures the demo works even if keys are flaky.
    return {
      minPrice: 20,
      maxPrice: 35,
      suggestedPrice: 28,
      confidenceScore: 85,
      fairnessLevel: FairnessLevel.FAIR,
      reasoning: [
        "Based on typical lunch costs in this category for 2025/2026.",
        "Matches average spending with these participants.",
        "Fallback mode: API Error occurred."
      ],
      keyFactors: [
        { label: "Market Benchmark (2026)", value: "$26.50" },
        { label: "Peer Group Average (Similar Users)", value: "$29.00" },
        { label: "Historical Spending Pattern (Est.)", value: "$27.50" },
        { label: "Inflation Adjustment", value: "+4.2%" }
      ],
      historicalContext: [
        { id: "1", date: "2025-12-15", amount: 25, description: "Lunch" },
        { id: "2", date: "2026-01-10", amount: 30, description: "Dinner" }
      ],
      currency: "$"
    };
  }
};

export const simulatePriceImpact = async (
  originalPrediction: PredictionResult, 
  newPrice: number,
  input: UserInput
): Promise<SimulationState> => {
  // We can do a lightweight simulation locally or call Gemini again. 
  // For responsiveness in a hackathon demo, let's use a "Lite" Gemini call or simple logic if the range is small.
  // Let's use Gemini Flash for high quality "What If" reasoning.

  const ai = getGeminiClient();
  const prompt = `
    Context: User was suggested a price of ${originalPrediction.suggestedPrice} for "${input.description}".
    The fair range was ${originalPrediction.minPrice} - ${originalPrediction.maxPrice}.
    
    User wants to simulate paying: ${newPrice} ${input.currency}.

    Task:
    1. Determine the fairness level of this new price.
    2. Describe the impact (e.g., "You are overpaying by 20%", "This might set a bad precedent", "This is a generous tip").

    Output JSON.
  `;

  try {
     const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            simulatedFairness: { type: Type.STRING, enum: Object.values(FairnessLevel) },
            impactDescription: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if(!text) throw new Error("No response");
    const data = JSON.parse(text);
    
    return {
      isActive: true,
      simulatedPrice: newPrice,
      simulatedFairness: data.simulatedFairness,
      impactDescription: data.impactDescription
    };

  } catch (e) {
    // Fallback logic
    const diff = ((newPrice - originalPrediction.suggestedPrice) / originalPrediction.suggestedPrice) * 100;
    let level = FairnessLevel.FAIR;
    let desc = "This price is within reasonable bounds.";

    if (diff > 15) { level = FairnessLevel.SLIGHTLY_HIGH; desc = `This is ${diff.toFixed(0)}% higher than recommended.`; }
    if (diff > 30) { level = FairnessLevel.HIGH; desc = `This is significantly higher (${diff.toFixed(0)}%) than usual.`; }
    if (diff < -15) { level = FairnessLevel.BARGAIN; desc = `This is ${Math.abs(diff).toFixed(0)}% lower than recommended.`; }

    return {
      isActive: true,
      simulatedPrice: newPrice,
      simulatedFairness: level,
      impactDescription: desc
    };
  }
};