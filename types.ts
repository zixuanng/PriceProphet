export enum FairnessLevel {
  FAIR = "Fair",
  SLIGHTLY_HIGH = "Slightly High",
  HIGH = "High",
  UNUSUAL = "Unusual",
  BARGAIN = "Bargain"
}

export interface HistoricalTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
}

export interface KeyFactor {
  label: string;
  value: string;
}

export interface PredictionResult {
  minPrice: number;
  maxPrice: number;
  suggestedPrice: number;
  confidenceScore: number; // 0-100
  fairnessLevel: FairnessLevel;
  reasoning: string[];
  keyFactors: KeyFactor[];
  historicalContext: HistoricalTransaction[];
  currency: string;
}

export interface UserInput {
  description: string;
  category: string;
  participants: string;
  currency: string;
}

export interface SimulationState {
  isActive: boolean;
  simulatedPrice: number;
  simulatedFairness: FairnessLevel;
  impactDescription: string;
}