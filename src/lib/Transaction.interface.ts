import { AccountTypeV2 } from './Account.enum';
import { Aggregator } from './Aggregator.interface';
import {
  TransactionBankOperationCategory,
  TransactionCreditCategory,
  TransactionExpenseCategory,
  TransactionIncomeCategory,
  TransactionRefundCategory,
  TransactionSavingCategory,
  TransactionTaxCategory,
  TransactionTemporaryCategory,
  TransactionType,
} from './Transaction.enum';

/**
 * Transaction
 */
export interface Transaction {
  /**
   * Stringified _id
   */
  id?: string;
  /**
   * Id of the account linked to the transaction on Algoan
   */
  accountId?: string;
  /**
   * Type of the account linked to the transaction on Algoan
   */
  accountType?: AccountTypeV2;
  /**
   * Dates associated with the transaction
   */
  dates: TransactionDates;
  /**
   * Description of the transaction taken from the banks's website
   */
  description: string;
  /**
   * Transaction's amount (negative if debit)
   */
  amount: number;
  /**
   * Transaction's currency
   * @format ISO 4217
   */
  currency: string;
  /**
   * Properties computed by Algoan
   */
  enrichments: Enrichments;
  /**
   * Indicates if the transaction will be debited in the future or not.
   */
  isComing: boolean;
  /**
   * Information set by the aggregator
   */
  aggregator?: Aggregator;
  /**
   * Comment on the transaction
   */
  comment?: string;
}

/**
 * Dates associated with the transaction
 */
export interface TransactionDates {
  /**
   * Debit date as seen on the bank statement
   */
  debitedAt?: string;
  /**
   * Realization date of the transaction
   */
  bookedAt?: string;
}

/**
 * Properties computed by Algoan
 */
export interface Enrichments {
  /**
   * Category of the transaction
   */
  category: TransactionCategoryType;
  /**
   * Nature of the transaction
   */
  type: TransactionType;
  /**
   * Indicates if the transaction has been rejected or not.
   */
  isRejected: boolean;
  /**
   * Id of the counterpart if the transaction is or has been rejected.
   */
  counterPartId?: string;
  /**
   * Group id of the transaction
   */
  groupId: string;
  /**
   * Description of the transaction group id
   */
  descriptionGroupId: string;
}

/**
 * All transaction categories
 */
export type TransactionCategoryType =
  | TransactionIncomeCategory
  | TransactionExpenseCategory
  | TransactionCreditCategory
  | TransactionSavingCategory
  | TransactionBankOperationCategory
  | TransactionRefundCategory
  | TransactionTaxCategory
  | TransactionTemporaryCategory;
