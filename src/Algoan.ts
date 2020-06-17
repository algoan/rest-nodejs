import { RequestBuilder } from './RequestBuilder';
import { ServiceAccount, ServiceAccountMap, Subscription } from './lib';
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
    let subscriptions: Subscription[] = [];

    for (const sa of this.serviceAccounts.values()) {
      if (serviceAccountIds.length === 0 || serviceAccountIds.includes(sa.id)) {
        const response: Subscription[] = await sa.requestBuilder.request({
          method: 'GET',
          url: '/v1/subscriptions',
        });
        subscriptions = subscriptions.concat(response);
        sa.subscriptions = response;
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
