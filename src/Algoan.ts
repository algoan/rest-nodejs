import { RequestBuilder } from './RequestBuilder';
import { PostSubscriptionDTO, EventName, Logger } from './lib';
import { ServiceAccount } from './core/ServiceAccount';
import { Subscription } from './core';
/**
 * Algoan API
 */
export class Algoan {
  /**
   * Public base URL
   */
  public baseUrl: string;
  /**
   * Service accounts stored in-memory
   */
  public serviceAccounts: ServiceAccount[];
  /**
   * Request builder instance
   */
  private readonly requestBuilder: RequestBuilder;

  constructor(parameters: AlgoanOptions) {
    this.baseUrl = parameters.baseUrl;
    this.requestBuilder = new RequestBuilder(
      this.baseUrl,
      {
        clientId: parameters.clientId,
        clientSecret: parameters.clientSecret,
        username: parameters.username,
        password: parameters.password,
      },
      {
        logger: parameters.logger,
        debug: parameters.debug,
      },
    );
    this.serviceAccounts = [];
  }

  /**
   * Init RestHooks
   * 1. Retrieves service accounts and store them in-memory
   * 2. For each service accounts, get or create subscriptions
   * @param target Unique BaseURL used for all of your services
   * @param events List of events to subscribe to
   * @param secret Optional secret, used to encrypt the X-Hub-Signature header
   */
  public async initRestHooks(target: string, events: EventName[], secret?: string): Promise<void>;
  /**
   * Init RestHooks
   * 1. Retrieves service accounts and store them in-memory
   * 2. For each service accounts, get or create subscriptions
   * @param subscriptionBodies List of subscription request body to create subscriptions
   */
  public async initRestHooks(subscriptionBodies: PostSubscriptionDTO[]): Promise<void>;
  public async initRestHooks(
    subscriptionOrTarget: string | PostSubscriptionDTO[],
    events: EventName[] = [],
    secret?: string,
  ): Promise<void> {
    this.serviceAccounts = await ServiceAccount.get(this.baseUrl, this.requestBuilder);

    if (this.serviceAccounts.length === 0) {
      return;
    }

    if (typeof subscriptionOrTarget === 'string' && events.length === 0) {
      return;
    }

    const eventNames: EventName[] =
      typeof subscriptionOrTarget === 'string'
        ? events
        : subscriptionOrTarget.map((sub: PostSubscriptionDTO) => sub.eventName);

    const subscriptionDTO: PostSubscriptionDTO[] =
      typeof subscriptionOrTarget === 'string'
        ? this.fromEventToSubscriptionDTO(subscriptionOrTarget, eventNames, secret)
        : subscriptionOrTarget;

    for (const serviceAccount of this.serviceAccounts) {
      await serviceAccount.getOrCreateSubscriptions(subscriptionDTO, eventNames);
    }
  }

  /**
   * Get a service account with a given subscription id
   * @param subscriptionId Unique subscription identifier
   */
  public getServiceAccountBySubscriptionId(subscriptionId: string): ServiceAccount | undefined {
    return this.serviceAccounts.find((sa: ServiceAccount) =>
      sa.subscriptions.find((sub: Subscription) => sub.id === subscriptionId),
    );
  }

  /**
   * Transform a list of events to a Subscription request body
   * @param target Base URL
   * @param eventName List of events
   * @param secret Secret
   */
  private readonly fromEventToSubscriptionDTO = (
    target: string,
    events: EventName[],
    secret?: string,
  ): PostSubscriptionDTO[] =>
    events.map(
      (event: EventName): PostSubscriptionDTO => ({
        target,
        secret,
        eventName: event,
      }),
    );
}

/**
 * Algoan constructor options
 */
interface AlgoanOptions {
  clientId: string;
  clientSecret?: string;
  baseUrl: string;
  username?: string;
  password?: string;
  debug?: boolean;
  logger?: Logger;
}
