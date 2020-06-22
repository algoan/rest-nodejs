import { IBanksUser, BanksUserStatus, PlugIn, Score, Analysis, PatchBanksUserDTO } from '../lib';
import { RequestBuilder } from '../RequestBuilder';

/**
 * BanksUser class
 */
export class BanksUser {
  /**
   * Unique identifier
   */
  public id: string;
  /**
   * Status of the bank user
   */
  public status: BanksUserStatus;
  /**
   * Redirect the user to an external User Interface
   */
  public redirectUrl: string;
  /**
   * The date of creation of the redirectUrl
   */
  public redirectUrlCreatedAt: number;
  /**
   * The max time of validity of the redirectUrl (in second)
   */
  public redirectUrlTTL: number;
  /**
   * Used to redirect the user after an external process
   */
  public callbackUrl: string;
  /**
   * List of plug-in linked to the aggregation process
   */
  public plugIn?: PlugIn;
  /**
   * Algoan Score
   */
  public scores: Score[];
  /**
   * Set of indicators representing the state of user banking and financial information
   */
  public analysis: Analysis;
  /**
   * Request builder instance
   */
  private readonly requestBuilder: RequestBuilder;

  constructor(params: IBanksUser, requestBuilder: RequestBuilder) {
    this.id = params.id;
    this.status = params.status;
    this.redirectUrl = params.redirectUrl;
    this.redirectUrlCreatedAt = params.redirectUrlCreatedAt;
    this.redirectUrlTTL = params.redirectUrlTTL;
    this.callbackUrl = params.callbackUrl;
    this.plugIn = params.plugIn;
    this.scores = params.scores;
    this.analysis = params.analysis;
    this.requestBuilder = requestBuilder;
  }

  /**
   * Fetch a banksUser by ID
   *
   * @param id Id of the BanksUser to fetch
   * @param requestBuilder Service account request builder
   */
  public static async getBanksUserById(id: string, requestBuilder: RequestBuilder): Promise<BanksUser> {
    const banksUser: IBanksUser = await requestBuilder.request({
      url: `/v1/banks-users/${id}`,
      method: 'GET',
    });

    return new BanksUser(banksUser, requestBuilder);
  }

  /**
   * Update a banksUser
   * @param body Patch banks user request body
   */
  public async update(body: PatchBanksUserDTO): Promise<void> {
    const banksUser: IBanksUser = await this.requestBuilder.request({
      url: `/v1/banks-users/${this.id}`,
      method: 'PATCH',
      data: body,
    });

    this.id = banksUser.id;
    this.status = banksUser.status;
    this.redirectUrl = banksUser.redirectUrl;
    this.redirectUrlCreatedAt = banksUser.redirectUrlCreatedAt;
    this.redirectUrlTTL = banksUser.redirectUrlTTL;
    this.callbackUrl = banksUser.callbackUrl;
    this.plugIn = banksUser.plugIn;
    this.scores = banksUser.scores;
    this.analysis = banksUser.analysis;
  }
}
