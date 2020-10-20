import {
  IBanksUser,
  BanksUserStatus,
  PlugIn,
  Score,
  Analysis,
  PatchBanksUserDTO,
  PostBanksUserAccountDTO,
  PostBanksUserTransactionDTO,
  MultiResourceCreationResponse,
  BanksUserTransaction,
  BanksUserAccount,
  PostBanksUserDTO,
  Aden,
} from '../lib';
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
  public callbackUrl?: string;
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
  public analysis?: Analysis;
  /**
   * Optional identifier
   */
  public partnerId?: string;
  /**
   * ADEN triggers
   */
  public adenTriggers?: { onSynchronizationFinished?: boolean; bankreaderLinkRequired?: boolean };
  /**
   * Score result
   */
  public aden?: Aden;
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
    this.partnerId = params.partnerId;
    this.adenTriggers = params.adenTriggers;
    this.aden = params.aden;
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
   * Create a new Banks User
   * @param body POST banks user request body
   * @param requestBuilder Request builder
   */
  public static async create(body: PostBanksUserDTO, requestBuilder: RequestBuilder): Promise<BanksUser> {
    const banksUser: IBanksUser = await requestBuilder.request({
      method: 'POST',
      url: '/v1/banks-users',
      data: body,
    });

    return new BanksUser(banksUser, requestBuilder);
  }

  /**
   * Fetch all Accounts related to a BankUserID
   *
   * @param id Id of the BanksUser to fetch
   * @param requestBuilder Service account request builder
   *
   * @returns Array of BanksUserAccount
   */
  public static async getAccounts(id: string, requestBuilder: RequestBuilder): Promise<BanksUserAccount[]> {
    const accounts: BanksUserAccount[] = await requestBuilder.request({
      url: `/v1/banks-users/${id}/accounts`,
      method: 'GET',
    });

    return accounts;
  }

  /**
   * Fetch all Transactions related to a BankUserID and an AccountID
   *
   * @param bankUserId Id of the BanksUser to fetch
   * @param accountId Id of the Account to fetch
   * @param requestBuilder Service account request builder
   *
   * @returns Array of BanksUserTransaction
   */
  public static async getTransactionsPerAccounts(
    bankUserId: string,
    accountId: string,
    requestBuilder: RequestBuilder,
  ): Promise<BanksUserTransaction[]> {
    const accounts: BanksUserTransaction[] = await requestBuilder.request({
      url: `/v1/banks-users/${bankUserId}/accounts/${accountId}/transactions`,
      method: 'GET',
    });

    return accounts;
  }

  /**
   * Update a banksUser
   * @param body Patch banks user request body
   */
  public async update(body: PatchBanksUserDTO, code?: string): Promise<void> {
    let url: string = `/v1/banks-users/${this.id}`;

    if (code !== undefined) {
      url += `?code=${code}`;
    }

    const banksUser: IBanksUser = await this.requestBuilder.request({
      url,
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

  /**
   * Creates accounts for the BankUser
   * @param body Array of BanksUser Accounts to Post
   */
  public async createAccounts(body: PostBanksUserAccountDTO[]): Promise<BanksUserAccount[]> {
    const accounts: BanksUserAccount[] = await Promise.all(
      body.map(
        async (banksUserAccount: PostBanksUserAccountDTO): Promise<BanksUserAccount> =>
          this.requestBuilder.request({
            url: `/v1/banks-users/${this.id}/accounts`,
            method: 'POST',
            data: banksUserAccount,
          }),
      ),
    );

    return accounts;
  }

  /**
   * Creates transactions for the given BankUser accounts
   * @param body Array of Transactions to Post
   */
  public async createTransactions(
    accountId: string,
    body: PostBanksUserTransactionDTO[],
  ): Promise<MultiResourceCreationResponse<BanksUserTransaction>> {
    const transactions: MultiResourceCreationResponse<BanksUserTransaction> = await this.requestBuilder.request({
      url: `/v1/banks-users/${this.id}/accounts/${accountId}/transactions`,
      method: 'POST',
      data: body,
    });

    return transactions;
  }
}
