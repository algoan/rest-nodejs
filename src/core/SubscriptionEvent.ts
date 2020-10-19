import { GetSubscriptionEventsDTO, ISubscriptionEvent, PatchSubscriptionEventDTO } from '../lib';
import { RequestBuilder } from '../RequestBuilder';

/**
 * SubscriptionEvent class
 */
export class SubscriptionEvent {
  /**
   * Unique event identifier
   */
  public eventId: string;
  /**
   * Unique subscription identifier
   */
  public subscriptionId: string;

  constructor(params: { eventId: string; subscriptionId: string }, private readonly requestBuilder: RequestBuilder) {
    this.eventId = params.eventId;
    this.subscriptionId = params.subscriptionId;
  }

  /**
   * Get the list of events emitted on a subscription for an applicationId
   * @param params the parameters of the request
   */
  public static async get(
    requestBuilder: RequestBuilder,
    subscriptionId: string,
    query: GetSubscriptionEventsDTO,
  ): Promise<ISubscriptionEvent[]> {
    return requestBuilder.request({
      url: `/v1/subscriptions/${subscriptionId}/events`,
      method: 'GET',
      params: query,
    });
  }

  /**
   * Update a subscription's event status
   * @param body Patch subscription's event request body
   */
  public async update(body: PatchSubscriptionEventDTO): Promise<ISubscriptionEvent & { id: string }> {
    return this.requestBuilder.request({
      url: `/v1/subscriptions/${this.subscriptionId}/events/${this.eventId}`,
      method: 'PATCH',
      data: body,
    });
  }
}
