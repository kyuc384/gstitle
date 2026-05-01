export interface HistoricalData {
  title: string;
  ctr: number;
}

export interface TitleGenerationResult {
  learning: {
    high_ctr_patterns: string;
    low_ctr_patterns: string;
    winning_formulas: string;
    psychology_triggers: string;
  };
  title_strategy_model: string;
  titles: {
    title: string;
    reason: string;
    predicted_ctr_score: number;
  }[];
}
