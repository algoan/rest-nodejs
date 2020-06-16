import { stringify } from 'querystring';
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Axios layer setting automatically an authorization header
 */
export class RequestBuilder {
  /**
   * Axios instance
   */
  protected axiosInstance: AxiosInstance;
  /**
   * Access token instance
   */
  private accessTokenInstance?: AccessToken;

  constructor(private readonly baseUrl: string, private readonly credentials: Credentials) {
    this.axiosInstance = Axios.create({
      baseURL: this.baseUrl,
    });
    this.axiosInstance.interceptors.request.use(
      async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
        // eslint-disable-next-line @typescript-eslint/tslint/config
        config.headers.Authorization = await this.getAuthorizationHeader();

        return config;
      },
    );
  }

  /**
   * Set the authorization header
   */
  private async getAuthorizationHeader(): Promise<string> {
    /*
     * If the access token is already defined, check if it is expired
     */
    const { isAccessTokenExpired, isRefreshTokenExpired } = this.isExpired();

    if (this.accessTokenInstance !== undefined && isAccessTokenExpired && !isRefreshTokenExpired) {
      const token: AxiosResponse<OAuthResponse> = await Axios.post<OAuthResponse>(
        `${this.baseUrl}/v1/oauth/token`,
        stringify({
          refresh_token: this.accessTokenInstance.refresh_token,
          grant_type: 'refresh_token',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.accessTokenInstance = this.getAccessTokenInstance(token.data);

      return `Bearer ${this.accessTokenInstance.access_token}`;
    }

    const grantType: string =
      this.credentials.username !== undefined && this.credentials.password !== undefined
        ? 'password'
        : 'client_credentials';

    const request: AxiosResponse<OAuthResponse> = await Axios.post<OAuthResponse>(
      `${this.baseUrl}/v1/oauth/token`,
      stringify({
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
        username: this.credentials.username,
        password: this.credentials.password,
        grant_type: grantType,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    this.accessTokenInstance = this.getAccessTokenInstance(request.data);

    return `Bearer ${this.accessTokenInstance.access_token}`;
  }

  /**
   * Get expiration date from an access token instance
   */
  private readonly getAccessTokenInstance = (apiResponse: OAuthResponse): AccessToken => {
    const toMs: number = 1000;

    return {
      ...apiResponse,
      expiresAt: new Date(Date.now() + apiResponse.expires_in * toMs),
      refreshExpiresAt: new Date(Date.now() + apiResponse.refresh_expires_in * toMs),
    };
  };

  /**
   * Check if the access token or the refresh token is expired
   */
  private isExpired(): { isAccessTokenExpired: boolean; isRefreshTokenExpired: boolean } {
    if (this.accessTokenInstance === undefined) {
      return { isAccessTokenExpired: true, isRefreshTokenExpired: true };
    }
    const expirationWindow: number = 300;
    const minThreshold: number = this.accessTokenInstance.expiresAt.getTime() - expirationWindow;
    const minRTThreshold: number = this.accessTokenInstance.refreshExpiresAt.getTime() - expirationWindow;

    return {
      isAccessTokenExpired: minThreshold < Date.now(),
      isRefreshTokenExpired: minRTThreshold < Date.now(),
    };
  }

  /**
   * Request builder
   * @param config Axios request configurations
   */
  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.request(config);

    return response.data;
  }
}

/**
 * Credentials parameters
 */
interface Credentials {
  clientId: string;
  clientSecret?: string;
  username?: string;
  password?: string;
}

/**
 * Algoan OAuth server response
 */
/* eslint-disable camelcase */
interface OAuthResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  session_state: string;
  scope: string;
}
/* eslint-enable camelcase */

/**
 * Additional information calculated after getting access token
 */
interface ExpirationDate {
  expiresAt: Date;
  refreshExpiresAt: Date;
}

/**
 * Access token type
 */
type AccessToken = OAuthResponse & ExpirationDate;
