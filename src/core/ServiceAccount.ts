import { RequestBuilder } from '../RequestBuilder';
import { IServiceAccount } from '..';
import { PostSubscriptionDTO } from '../lib';
import { Subscription } from './Subscription';
import { BanksUser } from './BanksUser';

/**
 * Service account class
 */
export class ServiceAccount {
  /**
   * Unique identifier for the service account
   */
  public id: string;
  /**
   * OAuth2 Client ID
   */
  public clientId: string;
  /**
   * OAuth2 Client Secret
   */
  public clientSecret: string;
  /**
   * Service account date of creation
   */
  public createdAt: Date;
  /**
   * Subscriptions attached to the service account
   */
  public subscriptions: Subscription[];
  /**
   * Request builder instance
   */
  private readonly requestBuilder: RequestBuilder;

  constructor(baseUrl: string, params: IServiceAccount) {
    this.id = params.id;
    this.clientId = params.clientId;
    this.clientSecret = params.clientSecret;
    this.createdAt = new Date(params.createdAt);
    this.subscriptions = [];
    this.requestBuilder = new RequestBuilder(baseUrl, {
      clientId: params.clientId,
      clientSecret: params.clientSecret,
    });
  }

  /**
   * Get all service accounts
   * @param requestBuilder Request Builder instance
   */
  public static async get(baseUrl: string, requestBuilder: RequestBuilder): Promise<ServiceAccount[]> {
    const serviceAccounts: IServiceAccount[] = await requestBuilder.request({
      method: 'GET',
      url: '/v1/service-accounts',
    });

    return serviceAccounts.map((sa: IServiceAccount) => new ServiceAccount(baseUrl, sa));
  }

  /**
   * Fetch all subscriptions
   */
  public async getSubscriptions(): Promise<Subscription[]> {
    const subscriptions: Subscription[] = await Subscription.get(this.requestBuilder);
    this.subscriptions = subscriptions;

    return subscriptions;
  }

  /**
   * Create subscriptions for a specific service account
   * @param subscriptionBodies List of subscription request bodies
   */
  public async createSubscriptions(subscriptionBodies: PostSubscriptionDTO[]): Promise<Subscription[]> {
    const concatenatedSubscriptions: Subscription[] = [];

    for (const body of subscriptionBodies) {
      const newSubscription: Subscription = await Subscription.create(this.requestBuilder, body);
      this.subscriptions.push(newSubscription);
      concatenatedSubscriptions.push(newSubscription);
    }

    return concatenatedSubscriptions;
  }

  /**
   * Get or create subscriptions for a given service account
   * Update them to the ACTIVE status if there are not active
   * @param subscriptionBodies Subscription request bodies to potentially create
   */
  public async getOrCreateSubscriptions(subscriptionBodies: PostSubscriptionDTO[]): Promise<Subscription[]> {
    const subscriptions: Subscription[] = await this.getSubscriptions();

    if (subscriptions.length === 0) {
      return this.createSubscriptions(subscriptionBodies);
    }

    return Promise.all(
      subscriptions.map(async (subscription: Subscription) => {
        if (subscription.status !== 'ACTIVE') {
          await subscription.update({ status: 'ACTIVE' });
        }

        return subscription;
      }),
    );
  }
  /**
   * Get the service account authorization header
   */
  public async getAuthorizationHeader(): Promise<string> {
    return this.requestBuilder.getAuthorizationHeader();
  }

  /**
   * Fetch a banksUser by ID
   *
   * @param id Id of the BanksUser to fetch
   * @param requestBuilder Service account request builder
   */
  public async getBanksUserById(id: string): Promise<BanksUser> {
    return BanksUser.getBanksUserById(id, this.requestBuilder);
  }
}
