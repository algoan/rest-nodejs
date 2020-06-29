import * as nock from 'nock';

import { RequestBuilder } from '../src/RequestBuilder';
import { BanksUser } from '../src/core/BanksUser';
import { getFakeAlgoanServer, getOAuthServer } from './utils/fake-server.utils';
import {
  banksUser as banksUserSample,
  banksUserAccount as banksUserAccountSample,
  banksUserTransaction as banksUserTransactionSample,
  banksUserTransactionResponse as banksUserTransactionResponseSample,
} from './samples/banks-users';

describe('Tests related to the BanksUser class', () => {
  const baseUrl: string = 'http://localhost:3000';
  let banksUserAPI: nock.Scope;
  let requestBuilder: RequestBuilder;

  beforeEach(() => {
    getOAuthServer({
      baseUrl,
      isRefreshToken: false,
      isUserPassword: false,
      nbOfCalls: 1,
      expiresIn: 500,
      refreshExpiresIn: 2000,
    });
    requestBuilder = new RequestBuilder(baseUrl, {
      clientId: 'a',
      clientSecret: 's',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    nock.cleanAll();
  });

  describe('update()', () => {
    beforeEach(() => {
      banksUserAPI = getFakeAlgoanServer({
        baseUrl,
        path: '/v1/banks-users/id1',
        response: banksUserSample,
        method: 'patch',
      });
    });
    it('should update the BanksUser', async () => {
      const banksUser: BanksUser = new BanksUser(banksUserSample, requestBuilder);
      banksUser.status = 'NEW';

      await banksUser.update({
        status: 'FINISHED',
      });

      expect(banksUserAPI.isDone()).toBeTruthy();
      expect(banksUser.status).toEqual('FINISHED');
    });
  });

  describe('createAccounts()', () => {
    beforeEach(() => {
      banksUserAPI = getFakeAlgoanServer({
        baseUrl,
        path: '/v1/banks-users/id1/accounts',
        response: banksUserAccountSample,
        method: 'post',
      });
    });
    it('should create accounts on the BanksUser', async () => {
      const banksUser: BanksUser = new BanksUser(banksUserSample, requestBuilder);

      await banksUser.createAccounts([banksUserAccountSample]);

      expect(banksUserAPI.isDone()).toBeTruthy();
    });
  });

  describe('createTransactions()', () => {
    beforeEach(() => {
      banksUserAPI = getFakeAlgoanServer({
        baseUrl,
        path: '/v1/banks-users/id1/accounts/accountId1/transactions',
        response: banksUserTransactionResponseSample,
        method: 'post',
      });
    });
    it('should create accounts on the BanksUser', async () => {
      const banksUser: BanksUser = new BanksUser(banksUserSample, requestBuilder);

      await banksUser.createTransactions('accountId1', [banksUserTransactionSample]);

      expect(banksUserAPI.isDone()).toBeTruthy();
    });
  });
});
