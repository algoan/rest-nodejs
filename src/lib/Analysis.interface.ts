import { Account } from './Account.interface';
import { AnalysisSource, AnalysisStatus, DataOrigin } from './Analysis.enum';
import { Calendar } from './Calendar.interface';
import { CreditInsights } from './CreditInsights.interface';
import { ScoreV2 } from './Score.interface';

/**
 * Analysis
 */
export interface AnalysisV2 {
  /**
   * Id of the analysis
   */
  id: string;
  name?: string;
  /**
   * organization id to which the analysis is related
   */
  organizationId: string;
  /**
   * project id to which the analysis is related
   */
  projectId: string;
  /**
   * Id of the Keycloak user who created the customer
   * We fetch it from the sub of the JWT
   */
  userId?: string;
  /**
   * customer id to which the analysis is related
   */
  customerId: string;
  /**
   * Parameters
   */
  parameters?: AnalysisParameters;
  /**
   * Metadata
   */
  metadata?: AnalysisMetadata;
  /**
   * Source
   */
  source?: AnalysisSource;
  /**
   * Data origin
   */
  dataOrigin?: DataOrigin;
  /**
   * Status
   */
  status: AnalysisStatus;
  /**
   * Credit Insights
   */
  creditInsights?: CreditInsights;
  /**
   * Score
   */
  scores?: ScoreV2;
  /**
   * Error
   */
  error?: AnalysisError;
  /**
   * List of account used to obtain the analysis
   */
  accounts?: Account[];
  /**
   * Value added by mongoose
   */
  createdAt: string;
  /**
   * Value added by mongoose
   */
  updatedAt: string;
}

/**
 * Parameters for the analysis computation
 */

export interface AnalysisParameters {
  disableScores?: boolean;
  disableCreditInsights?: boolean;
}

/**
 * Metadata of the analysis
 */
export interface AnalysisMetadata {
  /**
   * Number of days between the call to Score and Credit Insights and the last transaction
   */
  lastTransactionGap: number;
  /**
   * Number of days between the first and last transaction on the intersection of CHECKING accounts
   */
  historicalDepth: number;
  /**
   * Monthly mean number of transactions
   */
  monthlyTransactionCount: number;
  /**
   * Number of "Checking" accounts
   */
  numberOfCheckings: number;
  /**
   * Number of "Saving" accounts
   */
  numberOfSavings: number;
  /**
   * Number of "Loan" accounts
   */
  numberOfLoans: number;
  /**
   * Date of the oldest transaction
   */
  firstTransactionDate: string;
  /**
   * Number of days for each month
   */
  calendar: Calendar[];
  /**
   * Total number of analysed transactions
   */
  totalTransactionCount: number;
}

/**
 * Details about an occurring error in the analysis
 */

export interface AnalysisError {
  code: string;
  message: string;
}
