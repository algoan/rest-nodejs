import { EventName } from './Algoan.enum';
import { SubscriptionStatus, BanksUserStatus, PlugIn, Score, Analysis } from './Algoan.interface';

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
