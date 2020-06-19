import { EventName } from './Algoan.enum';

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
