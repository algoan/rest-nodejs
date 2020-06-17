import * as delay from 'delay';
import * as nock from 'nock';
import { Algoan, Subscription } from '../src';
import { getFakeAlgoanServer, getOAuthServer } from './utils/fake-server.utils';
import { serviceAccounts } from './samples/service-accounts';
import { RequestBuilder } from '../src/RequestBuilder';
import { subscriptions } from './samples/subscriptions';

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

    it('ALG004 - should use the same access token instance', async () => {
      const algoanClient: Algoan = new Algoan({
        baseUrl,
        clientId: 'a',
        clientSecret: 'a',
      });
      const fakeOAuthServer: nock.Scope = getOAuthServer({
        expiresIn: 300,
        refreshExpiresIn: 2000,
        baseUrl,
        nbOfCalls: 2,
        isUserPassword: false,
        isRefreshToken: false,
      });
      getFakeAlgoanServer({
        baseUrl,
        path: '/v1/service-accounts',
        method: 'get',
        response: serviceAccounts,
        nbOfCalls: 2,
      });
      await algoanClient.getServiceAccounts();
      /**
       * accessTokenInstance does not exist, the API is called as client_credentials
       */
      expect(fakeOAuthServer.isDone()).toBeFalsy();
      /**
       * Call the same method
       */
      await algoanClient.getServiceAccounts();
      /**
       * Now that accessTokenInstance exist, it should not called the fake oauth server
       */
      expect(fakeOAuthServer.isDone()).toBeFalsy();
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
      expect(algoanClient.serviceAccounts.get(serviceAccounts[0].id)).toMatchObject({
        ...serviceAccounts[0],
        requestBuilder: expect.any(RequestBuilder),
      });
      expect(algoanClient.serviceAccounts.get(serviceAccounts[1].id)).toMatchObject({
        ...serviceAccounts[1],
        requestBuilder: expect.any(RequestBuilder),
      });
    });

    it('ALG101 - should successfully fetch service accounts even if it is empty', async () => {
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
        response: [],
      });
      await expect(algoanClient.getServiceAccounts()).resolves.toEqual([]);

      expect(fakeAlgoanServer.isDone()).toBeTruthy();
      expect(fakeOAuthServer.isDone()).toBeTruthy();
      expect(algoanClient.serviceAccounts.size).toEqual(0);
    });
  });

  describe('Subscriptions', () => {
    let algoanClient: Algoan;
    /**
     * Get all service accounts before
     */
    beforeEach(async () => {
      algoanClient = new Algoan({
        baseUrl,
        clientId: '1',
        clientSecret: '2',
      });
      getOAuthServer();
      getFakeAlgoanServer({
        baseUrl,
        path: '/v1/service-accounts',
        method: 'get',
        response: serviceAccounts,
      });

      await algoanClient.getServiceAccounts();
    });

    it('ALG200 - should successfully fetch all subscriptions for all service accounts', async () => {
      const fakeAlgoanService: nock.Scope = getFakeAlgoanServer({
        baseUrl,
        method: 'get',
        path: '/v1/subscriptions',
        response: subscriptions,
        nbOfCalls: 2,
      });
      /**
       * The oAuth service will be called for the two service accounts
       */
      getOAuthServer({
        expiresIn: 300,
        refreshExpiresIn: 2000,
        baseUrl,
        nbOfCalls: 2,
        isUserPassword: false,
        isRefreshToken: false,
      });

      /**
       * Concat subscriptions
       */
      let expectedResult: Subscription[] = subscriptions;
      expectedResult = expectedResult.concat(expectedResult);
      await expect(algoanClient.getSubscriptions()).resolves.toEqual(expectedResult);
      expect(fakeAlgoanService.isDone());
      expect(algoanClient.serviceAccounts.get(serviceAccounts[0].id)?.subscriptions).toEqual(subscriptions);
      expect(algoanClient.serviceAccounts.get(serviceAccounts[1].id)?.subscriptions).toEqual(subscriptions);
    });

    it('ALG201 - should successfully fetch all subscriptions for one service account', async () => {
      const fakeAlgoanService: nock.Scope = getFakeAlgoanServer({
        baseUrl,
        method: 'get',
        path: '/v1/subscriptions',
        response: subscriptions,
        nbOfCalls: 2,
      });
      getOAuthServer({
        expiresIn: 300,
        refreshExpiresIn: 2000,
        baseUrl,
        nbOfCalls: 1,
        isUserPassword: false,
        isRefreshToken: false,
      });

      await expect(algoanClient.getSubscriptions([serviceAccounts[0].id])).resolves.toEqual(subscriptions);
      expect(fakeAlgoanService.isDone());
      expect(algoanClient.serviceAccounts.get(serviceAccounts[0].id)?.subscriptions).toEqual(subscriptions);
      expect(algoanClient.serviceAccounts.get(serviceAccounts[1].id)?.subscriptions).toBeUndefined();
    });

    it('ALG202 - should do nothing, no service accounts retrieved', () => {});
  });
});
