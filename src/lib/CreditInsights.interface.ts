import { Calendar } from './Calendar.interface';
import { PeriodicityType, RepartitionType } from './CreditInsights.enum';
import { TransactionType } from './Transaction.enum';
import { Transaction, TransactionCategoryType } from './Transaction.interface';

/**
 * Credit Insights
 */
export interface CreditInsights {
  /**
   * CI version
   */
  version: string;
  /**
   * CashFlows
   */
  cashFlows: CashFlowV2[];
  /**
   * Incomes
   */
  incomes: IncomesV2;
  /**
   * Expenses
   */
  expenses: Expenses;
  /**
   * Loans
   */
  loans: Loans;
  /**
   * Risk
   */
  risks: Risks;
}

/**
 * CashFlow
 */
export interface CashFlowV2 {
  /**
   * Stringified _id
   */
  id?: string;
  /**
   * Type of the cashflow
   */
  type: TransactionType;
  /**
   * Category of the cashflow
   */
  category: TransactionCategoryType;
  /**
   * Common root of all transactions belonging to the
   * same layer of similar descriptions (layer 2)
   */
  labelRoot: string;
  /**
   * Label of the group of transactions (cashflow) if applicable
   */
  label: string;
  /**
   * Total amount of the cashflow over the period. Negative if expense, positive if income.
   */
  totalAmount: number;
  /**
   * Total amount of the rejected transactions of the cashflow over the period.
   */
  totalRejectedAmount?: number;
  /**
   * Amount by month
   */
  calendar: Calendar[];
  /**
   * Concerned transactions
   */
  transactions: Transaction[];
  /**
   * Infos about regularity
   */
  regularity?: CashFlowRegularity;
}

/**
 * Regularity information about the cashflow
 */
export interface CashFlowRegularity {
  /**
   * Expected day of occurrence of the cashflow
   */
  dueDays?: number[];
  /**
   * Interval of regularity
   */
  interval?: CashFlowRegularityInterval;
  /**
   * Mean number of days between two transactions of the cashflow
   */
  meanNumberOfDaysInInterval?: number;
  /**
   * Accuracy of the interval of regularity
   */
  accuracy?: number;
  /**
   * Type of periodicity of the regularity
   */
  periodicity?: PeriodicityType;
  /**
   * Type of repartition of the transactions on the cash flow
   */
  repartition?: RepartitionType;
}

/**
 * Interval of regularity
 */
export interface CashFlowRegularityInterval {
  /**
   * Minimum regularity interval (in days) possible
   */
  min?: number;
  /**
   * Maximum regularity interval (in days) possible
   */
  max?: number;
}

/**
 * incomes details
 */

export interface IncomesV2 {
  /**
   * Total amount of incomes analysed
   **/
  totalAmount: number;
  /**
   * Mean incomes per month
   */
  monthlyAmount: number;
  /**
   * Customer incomes detailed as ratios
   */
  indicators: Indicators;
  /**
   * Transactions grouped by categories
   */
  categories: CategoryGroup[];
}

/**
 * Customer incomes detailed as ratios
 */
export interface Indicators {
  /**
   * Proportion of allowances in incomes
   */
  allowancesRatio: number;
}

/**
 * Expenses
 */
export interface Expenses {
  /**
   * Total amount of incomes analysed
   **/
  totalAmount: number;
  /**
   * Mean incomes per month
   */
  monthlyAmount: number;

  /**
   * Transactions grouped by categories
   */
  categories: CategoryGroup[];
  frequentTransactions: FrequentTransactions[];
}

/**
 * Frequent transactions
 */
export interface FrequentTransactions {
  /**
   * label of the group
   */
  label: string;
  /**
   * Concerned transactions
   */
  transactions: Transaction[];
}

/**
 * Category group
 */
export interface CategoryGroup {
  /**
   * Category name
   */
  name: TransactionCategoryType;
  /**
   * Total amount of the cashflow over the period. Negative if expense, positive if income.
   */
  totalAmount: number;
  /**
   * Mean incomes per month
   */
  monthlyAmount: number;
  /**
   * Amounts by date
   */
  calendar: Calendar[];
  /**
   * Concerned transactions
   */
  transactions: Transaction[];
}

/**
 * Loans
 */
export interface Loans {
  /**
   * Information about loan payments
   */
  repayments: LoansDetails;
  /**
   * Information about drawdowns loans
   */
  drawdowns: LoansDetails;
}

/**
 * Loan details
 */
export interface LoansDetails {
  /**
   * number of concerned transactions
   */
  count?: number;
  /**
   * Total amount
   */
  totalAmount: number;
  /**
   * Monthly payments amount
   */
  monthlyAmount?: number;
  /**
   * All cashflows related
   */
  details: CashFlowV2[];
}

/**
 * Risk
 */
export interface Risks {
  /**
   * Gambling
   */
  gambling: TransactionGroupDetail;
  /**
   * Incidents
   */
  incidents: Incidents;
  /**
   * Overdraft infos
   */
  overdraft: Overdraft;
  /**
   * Heavy failures
   */
  heavyFailures: HeavyFailures;
  /**
   * Wage advance
   */
  wageAdvance: TransactionGroupDetail;
}

/**
 * Heavy failure
 */
export interface HeavyFailures {
  /**
   * Direct recovery of debt
   */
  directRecoveryOfDebt: TransactionGroupDetail;
  /**
   * Banks account seizure
   */
  bankAccountSeizure: TransactionGroupDetail;
}

/**
 * Incidents
 */
export interface Incidents {
  /**
   * Payment rejections
   */
  paymentRejections: Rejections;
  /**
   * Check rejections
   */
  checkRejections: Rejections;
  /**
   * intervention fees
   */
  interventionFees: TransactionGroupDetail;
}

/**
 * Rejections
 */
export interface Rejections {
  /**
   * Total amount of the related transactions
   */
  totalAmount: number;
  /**
   * total amount of fees due to check rejection
   */
  totalFeesAmount: number;
  /**
   * Related tansactions
   */
  transactions: Transaction[];
  /**
   * Fees transactions
   */
  feesTransactions: Transaction[];
}

/**
 * Overdraft
 */
export interface Overdraft {
  /**
   * Maximum negative balance reached
   */
  minimumBalanceReached: number;
  /**
   * Number of days in hard overdraft
   */
  duration: number;
  /**
   * Overdraft Fees
   */
  fees: TransactionGroupDetail;
}

/**
 * Transaction group details
 */
export interface TransactionGroupDetail {
  /**
   * Total amount
   */
  totalAmount: number;
  /**
   * Concerned transactions
   */
  transactions: Transaction[];
}
