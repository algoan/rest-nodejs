/**
 * Evaluation of the probability of default
 */
export interface ScoreV2 {
  /**
   * Twelve month default score
   */
  creditScore?: CreditScore;
}

/**
 * Twelve month default score
 */
export interface CreditScore {
  /**
   * Score's version
   */
  version: string;
  /**
   * Between 0 and 1000. 0 is risky, 1000 is safe.
   */
  value: number;
  indicators?: CreditScoreIndicators;
}

/**
 * Credit score indicators
 */
export interface CreditScoreIndicators {
  /**
   * Living standard indicator
   */
  livingStandard: number;
  /**
   * Budget management indicator
   */
  budgetManagement: number;
  /**
   * Financial evolution indicator
   */
  financialEvolution: number;
}
