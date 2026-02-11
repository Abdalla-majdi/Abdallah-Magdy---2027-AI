
export enum EvaluationStatus {
  SUPPORTED = 'SUPPORTED',
  REFUTED = 'REFUTED',
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
  PARTIALLY_SUPPORTED = 'PARTIALLY_SUPPORTED'
}

export interface AssumptionEvaluation {
  assumption: string;
  status: EvaluationStatus;
  reasoning: string;
  supportingFacts: string[];
  conflictingFacts: string[];
  missingDataPoints: string[];
}

export interface AnalysisResult {
  summary: string;
  evaluations: AssumptionEvaluation[];
  overallConfidence: number; // 0 to 1
  keyDecisionRecommendation: string;
}

export interface AppState {
  data: string;
  assumptions: string;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}
