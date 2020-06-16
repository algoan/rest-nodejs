import * as delay from 'delay';
import * as nock from 'nock';
import { Algoan } from '../src';
import { getFakeAlgoanServer, getOAuthServer } from './utils/fake-server.utils';
import { serviceAccounts } from './samples/service-accounts';

describe('Tests related to the Algoan class', () => {
  const baseUrl: string = 'http://localhost:3000';

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Authentication', () => {
    it('ALG001 - should authenticate normally', async () => {
      const algoanClient: Algoan = new Algoan({
        baseUrl,
        clientId: 'a',
        clientSecret: 'a',
      });
      const fakeOAuthServer: nock.Scope = getOAuthServer();
      getFakeAlgoanServer({
        baseUrl,
        path: '/v1/service-accounts',
        method: 'get',
        response: serviceAccounts,
      });
      await algoanClient.getServiceAccounts();

      expect(fakeOAuthServer.isDone()).toBeTruthy();
    });

    it('ALG002 - should authenticate normally with username/password', async () => {
      const algoanClient: Algoan = new Algoan({
        baseUrl,
        clientId: 'a',
        username: 'a',
        password: 'a',
      });
      const fakeOAuthServer: nock.Scope = getOAuthServer({
        baseUrl,
        isUserPassword: true,
        isRefreshToken: false,
        nbOfCalls: 1,
      });
      getFakeAlgoanServer({
        baseUrl,
        path: '/v1/service-accounts',
        method: 'get',
        response: serviceAccounts,
      });
      await algoanClient.getServiceAccounts();

      expect(fakeOAuthServer.isDone()).toBeTruthy();
    });

    it('ALG003 - should be expired and should generate a new access token with the refresh token', async () => {
      const algoanClient: Algoan = new Algoan({
        baseUrl,
        clientId: 'a',
        clientSecret: 'a',
      });
      let fakeOAuthServer: nock.Scope = getOAuthServer();
      getFakeAlgoanServer({
        baseUrl,
        path: '/v1/service-accounts',
        method: 'get',
        response: serviceAccounts,
      });
      await algoanClient.getServiceAccounts();
      /**
       * accessTokenInstance does not exist, the API is called as client_credentials
       */
      expect(fakeOAuthServer.isDone()).toBeTruthy();
      /**
       * As expires_in is set to 300ms, it should be expired
       * The refresh_token is still valid
       */
      await delay(400);
      const secondFakeOAuthServer: nock.Scope = getOAuthServer({
        baseUrl,
        isRefreshToken: true,
        nbOfCalls: 1,
        isUserPassword: false,
      });
      getFakeAlgoanServer({
        baseUrl,
        path: '/v1/service-accounts',
        method: 'get',
        response: serviceAccounts,
      });

      await algoanClient.getServiceAccounts();
      expect(secondFakeOAuthServer.isDone()).toBeTruthy();
      /**
       * Then wait for the refresh token to be expired
       */
      await delay(2000);
      fakeOAuthServer = getOAuthServer();
      getFakeAlgoanServer({
        baseUrl,
        path: '/v1/service-accounts',
        method: 'get',
        response: serviceAccounts,
      });
      await algoanClient.getServiceAccounts();
      expect(fakeOAuthServer.isDone()).toBeTruthy();
    });
  });

  describe('Service Accounts', () => {
    it('ALG100 - should successfully fetch service accounts', async () => {
      const algoanClient: Algoan = new Algoan({
        baseUrl,
        clientId: '1',
        clientSecret: '2',
      });
      const fakeOAuthServer: nock.Scope = getOAuthServer();
      const fakeAlgoanServer: nock.Scope = getFakeAlgoanServer({
        baseUrl,
        path: '/v1/service-accounts',
        method: 'get',
        response: serviceAccounts,
      });
      await expect(algoanClient.getServiceAccounts()).resolves.toEqual(serviceAccounts);

      expect(fakeAlgoanServer.isDone()).toBeTruthy();
      expect(fakeOAuthServer.isDone()).toBeTruthy();
    });
  });
});
