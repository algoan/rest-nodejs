import { RequestBuilder } from '../RequestBuilder';
import { EventName } from './Algoan.enum';

/**
 * Service account body
 */
export interface ServiceAccount {
  id: string;
  clientId: string;
  clientSecret: string;
  createdAt: string;
}

/**
 * Subscription interface
 * https://developers.algoan.com/api/#operation/getResthookSubs
 */
export interface Subscription {
  id: string;
  eventName: EventName;
  secret?: string;
  status: 'ACTIVE' | 'DISABLE' | 'INACTIVE';
  target: string;
}

/**
 * Extended service account map
 */
export interface ServiceAccountMap extends ServiceAccount {
  subscriptions?: Subscription[];
  requestBuilder: RequestBuilder;
}
