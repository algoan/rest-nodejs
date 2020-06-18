import { RequestBuilder } from './RequestBuilder';
import { ServiceAccount, ServiceAccountMap, Subscription, PostSubscriptionDTO } from './lib';
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
  public serviceAccounts: Map<string, ServiceAccountMap>;
  /**
   * Request builder instance
   */
  private readonly requestBuilder: RequestBuilder;

  constructor(parameters: AlgoanOptions) {
    this.baseUrl = parameters.baseUrl;
    this.requestBuilder = new RequestBuilder(this.baseUrl, {
      clientId: parameters.clientId,
      clientSecret: parameters.clientSecret,
      username: parameters.username,
      password: parameters.password,
    });
    this.serviceAccounts = new Map();
  }

  /**
   * Return all service accounts and store them in-memory
   */
  public async getServiceAccounts(): Promise<ServiceAccount[]> {
    const serviceAccounts: ServiceAccount[] = await this.requestBuilder.request({
      method: 'GET',
      url: '/v1/service-accounts',
    });

    for (const serviceAccount of serviceAccounts) {
      this.serviceAccounts.set(serviceAccount.id, {
        ...serviceAccount,
        requestBuilder: new RequestBuilder(this.baseUrl, {
          clientId: serviceAccount.clientId,
          clientSecret: serviceAccount.clientSecret,
        }),
      });
    }

    return serviceAccounts;
  }

  /**
   * Get subscriptions for one particular service accounts or all of them
   * @param serviceAccountIds List of service account ids to match with
   */
  public async getSubscriptions(serviceAccountIds: string[] = []): Promise<Subscription[]> {
    return this.getOrCreateSubscriptions(serviceAccountIds);
  }

  /**
   * Create a subscription for each service accounts
   * @param body Subscription request body
   * @param serviceAccountIds List of service account ids to match with
   */
  public async createSubscription(
    body: PostSubscriptionDTO,
    serviceAccountIds: string[] = [],
  ): Promise<Subscription[]> {
    return this.getOrCreateSubscriptions(serviceAccountIds, body);
  }

  /**
   * Get or create a subscription and store them for each service accounts
   * @param serviceAccountIds List of service accounts to match with
   * @param body Subscription request body
   */
  private async getOrCreateSubscriptions(
    serviceAccountIds: string[],
    body?: PostSubscriptionDTO,
  ): Promise<Subscription[]> {
    let subscriptions: Subscription[] = [];
    const isCreate: boolean = body !== undefined;

    for (const sa of this.serviceAccounts.values()) {
      if (serviceAccountIds.length === 0 || serviceAccountIds.includes(sa.id)) {
        const response: Subscription[] | Subscription = await sa.requestBuilder.request({
          method: isCreate ? 'POST' : 'GET',
          url: '/v1/subscriptions',
          data: body,
        });

        if (sa.subscriptions === undefined) {
          sa.subscriptions = [];
        }

        if (Array.isArray(response)) {
          subscriptions = subscriptions.concat(response);
          sa.subscriptions = response;
        } else {
          subscriptions.push(response);
          sa.subscriptions.push(response);
        }
      }
    }

    return subscriptions;
  }
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
}
