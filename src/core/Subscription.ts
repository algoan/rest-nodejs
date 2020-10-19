import { createHmac } from 'crypto';

import { EventName, SubscriptionStatus, ISubscription, PostSubscriptionDTO, PatchSubscriptionDTO } from '../lib';
import { RequestBuilder } from '../RequestBuilder';
import { SubscriptionEvent } from './SubscriptionEvent';

/**
 * Subscription class
 */
export class Subscription {
  /**
   * Unique identifier
   */
  public id: string;
  /**
   * Base URL of the service resthooks
   */
  public target: string;
  /**
   * Event name
   */
  public eventName: EventName;
  /**
   * Subscription status
   */
  public status: SubscriptionStatus;
  /**
   * Optional secret
   * It is highly recommended to set a secret
   */
  public secret?: string;

  constructor(params: ISubscription, private readonly requestBuilder: RequestBuilder) {
    this.id = params.id;
    this.target = params.target;
    this.eventName = params.eventName;
    this.status = params.status;
    this.secret = params.secret;
  }

  /**
   * Get all subscriptions attached to a service account
   * @param requestBuilder Service account request builder
   */
  public static async get(requestBuilder: RequestBuilder): Promise<Subscription[]> {
    const subscriptions: ISubscription[] = await requestBuilder.request({
      url: '/v1/subscriptions',
      method: 'GET',
    });

    return subscriptions.map((sub: ISubscription) => new Subscription(sub, requestBuilder));
  }

  /**
   * Create a new subscription
   * @param requestBuilder Service account request builder
   * @param body Subscription request body
   */
  public static async create(requestBuilder: RequestBuilder, body: PostSubscriptionDTO): Promise<Subscription> {
    const subscription: ISubscription = await requestBuilder.request({
      url: '/v1/subscriptions',
      method: 'POST',
      data: body,
    });

    return new Subscription(subscription, requestBuilder);
  }

  /**
   * Update a subscription status
   * @param body Patch subscription request body
   */
  public async update(body: PatchSubscriptionDTO): Promise<void> {
    await this.requestBuilder.request({
      url: `/v1/subscriptions/${this.id}`,
      method: 'PATCH',
      data: body,
    });

    this.status = body.status;
  }

  /**
   * Validates an Algoan Resthook with the "x-hub-signature" header
   * More information here: https://developers.algoan.com/public/docs/algoan_documentation/resthooks_and_events/resthooks.html#validating-resthook-events
   * @param signatureHeader Signature header received
   * @param payload Payload sent
   */
  public validateSignature(signatureHeader: string, payload: { [key: string]: string }): boolean {
    if (this.secret === undefined) {
      return true;
    }

    const expectedHash: string = createHmac('sha256', this.secret).update(JSON.stringify(payload)).digest('hex');

    return `sha256=${expectedHash}` === signatureHeader;
  }

  /**
   * Create an event
   * @param id Unique event identifier
   */
  public event(id: string): SubscriptionEvent {
    return new SubscriptionEvent({ eventId: id, subscriptionId: this.id }, this.requestBuilder);
  }
}
