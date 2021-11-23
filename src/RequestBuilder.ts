import { stringify } from 'querystring';
import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Logger } from 'winston';

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
  /**
   * API version
   */
  public apiVersion: number;

  constructor(
    private readonly baseUrl: string,
    private readonly credentials: Credentials,
    options?: { debug?: boolean; logger?: Logger; version?: number },
    private _authorizationHeader?: string,
  ) {
    this.axiosInstance = Axios.create({
      baseURL: this.baseUrl,
    });
    this.apiVersion = options?.version ?? 1;
    this.axiosInstance.interceptors.request.use(
      async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
        // eslint-disable-next-line @typescript-eslint/tslint/config
        if (config.headers == undefined) {config.headers = {}}
        config.headers.Authorization =
          // eslint-disable-next-line @typescript-eslint/tslint/config
          config.headers.Authorization ?? (this.authorizationHeader as string) ?? (await this.getAuthorizationHeader());

        return config;
      },
    );
    if (options?.debug === true && options.logger !== undefined) {
      const logger: Logger = options.logger;
      this.axiosInstance.interceptors.request.use(
        async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
          logger.info(`${this.credentials.clientId} - [${config.method} ${config.url}] Incoming request`, {
            headers: config.headers,
            data: config.data,
          });

          return config;
        },
      );

      this.axiosInstance.interceptors.response.use(
        <T>(response: AxiosResponse<T>): AxiosResponse<T> => {
          logger.info(
            `${this.credentials.clientId} - [${response.status} ${response.config.method} ${response.config.url}] Outcoming request`,
            {
              headers: response.headers,
              data: response.data,
            },
          );

          return response;
        },
        async <T>(error: AxiosError<T>): Promise<AxiosError<T>> => {
          /* istanbul ignore next */
          logger.error(
            `ERROR ${this.credentials.clientId} - [${error?.response?.status} ${error.config.method} ${error.config.url}] Outcoming request`,
            {
              data: error?.response?.data,
            },
          );

          return Promise.reject(error);
        },
      );
    }
  }

  /**
   * Set the authorization header
   */
  public async getAuthorizationHeader(): Promise<string> {
    /*
     * If the access token is already defined, check if it is expired
     */
    const { isAccessTokenExpired, isRefreshTokenExpired } = this.isExpired();

    if (this.accessTokenInstance !== undefined && !isAccessTokenExpired && !isRefreshTokenExpired) {
      return `Bearer ${this.accessTokenInstance.access_token}`;
    }

    if (this.accessTokenInstance !== undefined && isAccessTokenExpired && !isRefreshTokenExpired) {
      let token: AxiosResponse<OAuthResponse>;
      try {
        token = await this.generateToken(true);
      } catch (err) {
        token = await this.generateToken();
      }

      this.accessTokenInstance = this.getAccessTokenInstance(token.data);

      return `Bearer ${this.accessTokenInstance.access_token}`;
    }

    const request: AxiosResponse<OAuthResponse> = await this.generateToken();

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

  /**
   * Set the property authorizationHeader
   * @param authorizationHeader : authorization to set
   */
  public set authorizationHeader(authorizationHeader: string | undefined) {
    // eslint-disable-next-line no-underscore-dangle
    this._authorizationHeader = authorizationHeader;
  }

  /**
   * Get the property authorizationHeader
   */
  public get authorizationHeader(): string | undefined {
    // eslint-disable-next-line no-underscore-dangle
    return this._authorizationHeader;
  }

  /**
   * Call the auth route to generate a token
   * @param fromRefreshToken if set to true, use the grant type refresh_token
   * @returns
   */
  private generateToken(fromRefreshToken: boolean = false): Promise<AxiosResponse<OAuthResponse>> {
    const grantType: string =
      this.credentials.username !== undefined && this.credentials.password !== undefined
        ? 'password'
        : 'client_credentials';

    const body = fromRefreshToken
      ? {
          refresh_token: (this.accessTokenInstance as AccessToken).refresh_token,
          grant_type: 'refresh_token',
          client_id: this.credentials.clientId,
          client_secret: this.credentials.clientSecret,
        }
      : {
          client_id: this.credentials.clientId,
          client_secret: this.credentials.clientSecret,
          username: this.credentials.username,
          password: this.credentials.password,
          grant_type: grantType,
        };
    return Axios.post<OAuthResponse>(`${this.baseUrl}/v${this.apiVersion}/oauth/token`, stringify(body), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
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
