import { EventName, SubscriptionStatus, ISubscription, PostSubscriptionDTO, PatchSubscriptionDTO } from '../lib';
import { RequestBuilder } from '../RequestBuilder';

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
}
