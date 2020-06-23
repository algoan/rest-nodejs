import * as nock from 'nock';

import { Algoan, EventName, ServiceAccount, Subscription, RequestBuilder } from '../src';
import { serviceAccounts } from './samples/service-accounts';
import { subscriptions as subscriptionsSample } from './samples/subscriptions';
import { getFakeAlgoanServer, getOAuthServer } from './utils/fake-server.utils';

describe('Tests related to the Algoan class', () => {
  describe('initRestHooks()', () => {
    const baseUrl: string = 'http://localhost:3000';
    let subscriptionAPI: nock.Scope;
    let serviceAccountAPI: nock.Scope;

    beforeEach(() => {
      subscriptionAPI = getFakeAlgoanServer({
        baseUrl,
        path: '/v1/subscriptions',
        response: subscriptionsSample,
        method: 'get',
        nbOfCalls: 2,
      });
      getOAuthServer({
        baseUrl,
        isRefreshToken: false,
        isUserPassword: false,
        nbOfCalls: 3,
        expiresIn: 500,
        refreshExpiresIn: 2000,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
      nock.cleanAll();
    });

    it('ALG001 - should correctly get subscriptions and service accounts', async () => {
      serviceAccountAPI = getFakeAlgoanServer({
        baseUrl,
        path: '/v1/service-accounts',
        response: serviceAccounts,
        method: 'get',
      });
      const client: Algoan = new Algoan({
        baseUrl,
        clientId: 'a',
        clientSecret: 'b',
      });

      await client.initRestHooks('http', [EventName.APPLICATION_UPDATED], 'a');
      expect(serviceAccountAPI.isDone()).toBeTruthy();
      expect(subscriptionAPI.isDone()).toBeTruthy();

      expect(client.serviceAccounts).toHaveLength(2);
      expect(client.serviceAccounts[0].subscriptions).toHaveLength(2);
    });

    it('ALG002 - should do nothing - no service account', async () => {
      serviceAccountAPI = getFakeAlgoanServer({
        baseUrl,
        path: '/v1/service-accounts',
        response: [],
        method: 'get',
      });

      const client: Algoan = new Algoan({
        baseUrl,
        clientId: 'a',
        clientSecret: 'b',
      });

      await client.initRestHooks('http', [EventName.APPLICATION_UPDATED], 'a');
      expect(serviceAccountAPI.isDone()).toBeTruthy();
      expect(subscriptionAPI.isDone()).toBeFalsy();

      expect(client.serviceAccounts).toHaveLength(0);
    });

    it('ALG003 - should do nothing - no event', async () => {
      serviceAccountAPI = getFakeAlgoanServer({
        baseUrl,
        path: '/v1/service-accounts',
        response: serviceAccounts,
        method: 'get',
      });

      const client: Algoan = new Algoan({
        baseUrl,
        clientId: 'a',
        clientSecret: 'b',
      });

      await client.initRestHooks('http', []);
      expect(serviceAccountAPI.isDone()).toBeTruthy();
      expect(subscriptionAPI.isDone()).toBeFalsy();

      expect(client.serviceAccounts).toHaveLength(2);
    });

    it('ALG004 - should correctly get subscriptions and service accounts - multiple bodies', async () => {
      serviceAccountAPI = getFakeAlgoanServer({
        baseUrl,
        path: '/v1/service-accounts',
        response: serviceAccounts,
        method: 'get',
      });
      const client: Algoan = new Algoan({
        baseUrl,
        clientId: 'a',
        clientSecret: 'b',
      });

      await client.initRestHooks([
        {
          target: 'http://',
          eventName: EventName.APPLICATION_UPDATED,
          secret: 'a',
        },
      ]);
      expect(serviceAccountAPI.isDone()).toBeTruthy();
      expect(subscriptionAPI.isDone()).toBeTruthy();

      expect(client.serviceAccounts).toHaveLength(2);
      expect(client.serviceAccounts[0].subscriptions).toHaveLength(2);
    });
  });

  describe('getServiceAccountBySubscriptionId()', () => {
    it('ALG010 - should get a service account stored in-memory', () => {
      const client: Algoan = new Algoan({
        baseUrl: 'random',
        clientId: 'a',
        clientSecret: 'b',
      });

      client.serviceAccounts.push(new ServiceAccount('https://', serviceAccounts[0]));
      client.serviceAccounts[0].subscriptions.push(
        new Subscription(
          subscriptionsSample[0],
          new RequestBuilder('http://', {
            clientSecret: 'a',
            clientId: 'a',
          }),
        ),
      );

      expect(client.getServiceAccountBySubscriptionId(subscriptionsSample[0].id)).toEqual(client.serviceAccounts[0]);
      expect(client.getServiceAccountBySubscriptionId('random')).toBeUndefined();
    });
  });
});
