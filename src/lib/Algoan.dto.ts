import { EventName, UsageType, AccountType, BanksUserTransactionType, BanksUserStatus } from './Algoan.enum';
import { SubscriptionStatus, PlugIn, Score, Analysis, LoanDetails } from './Algoan.interface';

/**
 * POST /subscriptions DTO interface
 */
export interface PostSubscriptionDTO {
  /** Event name to subscribe */
  eventName: EventName;
  /** URL of your service */
  target: string;
  /** Secret to decrypt x-hub-signature (more info [here](https://developers.algoan.com/public/docs/algoan_documentation/resthooks_and_events/resthooks.html#validating-resthook-events)) */
  secret?: string;
}

/**
 * PATCH /subscriptions/:id DTO interface
 */
export interface PatchSubscriptionDTO {
  /** Subscription status to update */
  status: SubscriptionStatus;
}

/**
 * PATCH /banks-user/:id DTO interface
 */
export interface PatchBanksUserDTO {
  status?: BanksUserStatus;
  redirectUrl?: string;
  redirectUrlTTL?: number;
  plugIn?: PlugIn;
  scores?: Score[];
  analysis?: Analysis;
}

/**
 * POST /banks-user/:id/accounts DTO interface
 */
export interface PostBanksUserAccountDTO {
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
 * POST /banks-user/:id/accounts/:accountId/transactions DTO interface
 */
export interface PostBanksUserTransactionDTO {
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
