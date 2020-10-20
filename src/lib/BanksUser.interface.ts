import {
  AnalysisAlerts,
  UsageType,
  AccountType,
  BanksUserTransactionType,
  BanksUserStatus,
  LoanAccountType,
  RegularCashFlowConfiguration,
} from './Algoan.enum';

/**
 * BanksUser
 */
export interface IBanksUser {
  id: string;
  status: BanksUserStatus;
  redirectUrl: string;
  redirectUrlCreatedAt: number;
  redirectUrlTTL: number;
  callbackUrl?: string;
  plugIn?: PlugIn;
  scores: Score[];
  analysis?: Analysis;
  adenTriggers?: { onSynchronizationFinished?: boolean; bankreaderLinkRequired?: boolean };
  partnerId?: string;
  aden?: Aden;
}

/**
 * List of plug-in linked to the aggregation process
 */
export interface PlugIn {
  budgetInsightBank?: {
    baseUrl: string;
    token: string;
  };
}

/**
 * Algoan Score
 */
export interface Score {
  createdAt: string;
  score: number;
  type: string;
  version: string;
}

/**
 * State of user banking and financial information
 * alerts are not
 */
export interface Analysis {
  alerts?: AnalysisAlerts[];
  regularCashFlows?: RegularCashFlow[];
  reliability?: ReliabilityStatus;
}

/**
 * Regular monthly estimated cash-flows
 */
export interface RegularCashFlow {
  amount: number;
  category: {
    frequency: number;
    name: string;
  };
  configuration: RegularCashFlowConfiguration;
  homogeneity: number;
}

/**
 * Reliability result statuses
 */
export type ReliabilityStatus = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * BanksUser Account
 */
export interface BanksUserAccount {
  id: string;
  balance: number;
  balanceDate: string;
  connectionSource: string;
  currency: string;
  type: AccountType;
  usage: UsageType;
  bank?: string;
  bic?: string;
  iban?: string;
  loanDetails?: LoanDetails;
  name?: string;
  reference?: string;
  savingsDetails?: string;
  status?: 'MANUAL' | 'ACTIVE' | 'ERROR' | 'NOT_FOUND' | 'CLOSED';
}

/**
 * BanksUser Account with transactions
 */
export interface BanksUserAccountWithTransactions extends BanksUserAccount {
  transactions: BanksUserTransaction[];
}

/**
 * Loan Details
 */
export interface LoanDetails {
  amount: number;
  debitedAccountId?: string;
  endDate: number;
  interestRate: number;
  payment: number;
  remainingCapital: number;
  startDate: number;
  type: LoanAccountType;
}

/**
 * BanksUser transation
 */
export interface BanksUserTransaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: BanksUserTransactionType;
  banksUserCardId?: string;
  currency?: string;
  reference?: string;
  simplifiedDescription?: string;
  userDescription?: string;
}

/**
 * ADEN details
 */
export interface Aden {
  budget: Budget;
  bureau: Bureau;
  dataQuality: DataQuality;
  score: ScoreResult;
}

/**
 * Bureau result
 */
interface Bureau {
  credit: {
    loans: Loan;
    locDrawDowns: Loan;
  };
  events: {
    bankAccountSeizure: boolean;
    thirdPartyHolderNotice: boolean;
    wageAdvances: AmountCount;
  };
  gambling: AmountCount;
  incidents: {
    checkRejections: AmountCount;
    fees: AmountCount;
    paymentRejections: AmountCount;
  };
  overdraft: {
    fees: AmountCount;
    hard: number;
    max: number;
    total: number;
  };
}

/**
 * Cashflow result
 */
interface Budget {
  cashflows: Cashflow[];
  indicators: {
    allowancesRatio: number;
    debtToIncome: number;
    residualIncome: number;
  };
}

/**
 * Data quality
 */
interface DataQuality {
  calendar: {
    month: number;
    nbDays: number;
  };
  historicalDepth: number;
  lastTransactionGap: number;
  numberOfCheckings: number;
  numberOfCreditCards: number;
  numberOfLoans: number;
  numberOfSavings: number;
  transactionsFrequency: number;
}

/**
 * Score v2 result
 */
interface ScoreResult {
  indicators: {
    cash: number;
    lifestyle: number;
    savings: number;
  };
  score: number;
}

/**
 * Cashflow model
 */
interface Cashflow {
  calendar: {
    amount: number;
    month: number;
  }[];
  dueDay?: number;
  label?: string;
  monthlyAmount: number;
  nbTransactions: number;
  references: string[];
  totalAmount: number;
  type: string;
}

/**
 * Amount-count
 */
interface AmountCount {
  amount: number;
  count: number;
}

/**
 * Loan
 */
interface Loan extends AmountCount {
  nbLenders: number;
}
