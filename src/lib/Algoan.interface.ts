import { EventName, AnalysisAlerts } from './Algoan.enum';

/**
 * Service account body
 */
export interface IServiceAccount {
  id: string;
  clientId: string;
  clientSecret: string;
  createdAt: string;
}

/**
 * Subscription interface
 * https://developers.algoan.com/api/#operation/getResthookSubs
 */
export interface ISubscription {
  id: string;
  eventName: EventName;
  secret?: string;
  status: SubscriptionStatus;
  target: string;
}

/**
 * Subscription statuses
 */
export type SubscriptionStatus = 'ACTIVE' | 'DISABLE' | 'INACTIVE';

/**
 * BanksUser
 */
export interface IBanksUser {
  id: string;
  status: BanksUserStatus;
  redirectUrl: string;
  redirectUrlCreatedAt: number;
  redirectUrlTTL: number;
  callbackUrl: string;
  plugIn?: PlugIn;
  scores: Score[];
  analysis: Analysis;
}

/**
 * BanksUser statuses
 */
export type BanksUserStatus = 'NEW' | 'SYNCHRONIZING' | 'FINISHED' | 'ACCOUNTS_SYNCHRONIZED';

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
 */
export interface Analysis {
  alerts: AnalysisAlerts[];
  regularCashFlows: RegularCashFlow[];
  reliability: ReliabilityStatus;
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
  configuration: 'A' | 'B' | 'C' | 'D';
  homogeneity: number;
}

/**
 * Reliability result statuses
 */
export type ReliabilityStatus = 'LOW' | 'MEDIUM' | 'HIGH';
