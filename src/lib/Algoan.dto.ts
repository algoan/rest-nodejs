import { EventName } from './Algoan.enum';

/**
 * POST /subscription DTO interface
 */
export interface PostSubscriptionDTO {
  /** Event name to subscribe */
  eventName: EventName;
  /** URL of your service */
  target: string;
  /** Secret to decrypt x-hub-signature (more info [here](https://developers.algoan.com/public/docs/algoan_documentation/resthooks_and_events/resthooks.html#validating-resthook-events)) */
  secret?: string;
}
