/**
 * Type of accounts
 */
export enum AccountTypeV2 {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  LOAN = 'LOAN',
  CREDIT_CARD = 'CREDIT_CARD',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Types of usage of an account
 */
export enum AccountUsage {
  PROFESSIONAL = 'PROFESSIONAL',
  PERSONAL = 'PERSONAL',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Savings account's types
 */
export enum SavingsType {
  SHORT_TERM = 'SHORT_TERM',
  LONG_TERM = 'LONG_TERM',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Loan types
 */
export enum LoanTypeV2 {
  REVOLVING = 'REVOLVING',
  PERSONAL = 'PERSONAL',
  MORTGAGE = 'MORTGAGE',
  OTHER = 'OTHER',
}
