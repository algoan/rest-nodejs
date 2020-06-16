import { RequestBuilder } from './RequestBuilder';
import { ServiceAccount } from './lib';
/**
 * Algoan API
 */
export class Algoan {
  /**
   * Public base URL
   */
  public baseUrl: string;
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
  }

  /**
   * Return all service accounts
   */
  public async getServiceAccounts(): Promise<ServiceAccount[]> {
    return this.requestBuilder.request({
      method: 'GET',
      url: '/v1/service-accounts',
    });
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
