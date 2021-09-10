import { AccountTypeV2, AccountUsage, LoanTypeV2, SavingsType } from './Account.enum';
import { Aggregator } from './Aggregator.interface';
import { Transaction } from './Transaction.interface';

/**
 * Account
 */
export interface Account {
  /**
   * Id of the account
   */
  id: string;
  /**
   * Id of the organization the account is related
   */
  organizationId: string;
  /**
   * Id of project the account is related
   */
  projectId: string;
  /**
   * Id of the customer the account is related
   */
  customerId: string;
  /**
   * Last known account balance
   */
  balance: number;
  /**
   * Date of the last known account balance
   */
  balanceDate: string;
  /**
   * Account's currency
   * @format ISO 4217
   */
  currency: string;
  /**
   * Account's type
   */
  type: AccountTypeV2;
  /**
   * Purpose of the account
   */
  usage: AccountUsage;
  /**
   * Owners of the account
   */
  owners: Owner[];
  /**
   * IBAN (International Bank Account Number) of the account
   */
  iban: string;
  /**
   * BIC (Business Identifier Code) of the account's bank
   */
  bic: string;
  /**
   * Name the account taken from the bank's website
   */
  name: string;
  /**
   * Properties computed by Algoan
   */
  bank: BankV2;
  /**
   * Code of the country of the account
   */
  country: string;
  /**
   * Value added by mongoose
   */
  createdAt: string;
  /**
   * Value added by mongoose
   */
  updatedAt: string;
  /**
   * Amount of coming operations (not yet debited)
   */
  coming: number;
  /**
   * Details of the account
   */
  details: Details;
  /**
   * Information set by the aggregator
   */
  aggregator?: Aggregator;
  /**
   * Account's transaction list
   */
  transactions: Transaction[];
  /**
   * Account's daily balances
   */
  dailyBalances: DailyBalance[];
}

/**
 * Information about the owner of the account
 * provided by the aggregator
 */
export interface Owner {
  /**
   * Name of the owner of the account
   */
  name: string;
}

/**
 * Account's Bank information
 */
export interface BankV2 {
  /**
   * Id of the account - aggregator unique identifier
   */
  id: string;
  /**
   * URL of the logo of the account's bank
   */
  logoUrl?: string;
  /**
   * Name of the account's bank
   */
  name: string;
  /**
   * Code of the country of the account's bank
   */
  country: string;
}

/**
 * Details model about an account
 */
export interface Details {
  /**
   * Details specific about a saving account
   */
  savings?: Savings;
  /**
   * Details specific to a loan account
   */
  loan?: Loan;
}

/**
 * Account's balance for a specific date
 */
export interface DailyBalance {
  date: string;
  balance: number;
}

/**
 * Details model about an account
 */
export interface Savings {
  /**
   * Saving account's type
   */
  type: SavingsType;

  /**
   * Opening date of the saving account
   */
  openedAt: string;

  /**
   * Maximum amount authorized for the saving account
   */
  maximumAmount: number;

  /**
   * Interest rate of the saving account
   */
  interestRate: number;
}

/**
 * Details specific to loan account
 */
export interface Loan {
  /**
   * Loan's type
   */
  type: LoanTypeV2;
  /**
   * Amount of the loan
   */
  amount: number;
  /**
   * Loan's start date
   */
  startDate: string;
  /**
   * Loan's end date
   */
  endDate: string;
  /**
   * Number of months the loan will take
   */
  duration: number;
  /**
   * Label of the insurance
   */
  insuranceLabel: string;
  /**
   * Monthly amount debited to repay the loan if it is amortizable
   */
  payment: number;
  /**
   * Remaining amount of the capital still to repay
   */
  remainingCapital: number;
  /**
   * Interest rate of the loan
   */
  interestRate: number;
}
