import * as nock from 'nock';

import { RequestBuilder } from '../src/RequestBuilder';
import { ServiceAccount } from '../src/core/ServiceAccount';
import { Subscription } from '../src/core/Subscription';
import { BanksUser } from '../src/core/BanksUser';
import { EventName } from '../src';
import { getFakeAlgoanServer, getOAuthServer } from './utils/fake-server.utils';
import { serviceAccounts as serviceAccountsSample } from './samples/service-accounts';
import { subscriptions as subscriptionSample } from './samples/subscriptions';
import { banksUser as banksUserSample } from './samples/banks-users';

describe('Tests related to the ServiceAccount class', () => {
  const baseUrl: string = 'http://localhost:3000';
  let serviceAccountAPI: nock.Scope;
  let requestBuilder: RequestBuilder;

  beforeEach(() => {
    serviceAccountAPI = getFakeAlgoanServer({
      baseUrl,
      path: '/v1/service-accounts',
      response: serviceAccountsSample,
      method: 'get',
    });
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

  describe('static get()', () => {
    it('SA001 - should get service accounts', async () => {
      const serviceAccounts: ServiceAccount[] = await ServiceAccount.get(baseUrl, requestBuilder);
      expect(serviceAccountAPI.isDone()).toBeTruthy();

      for (const sa of serviceAccounts) {
        expect(sa).toBeInstanceOf(ServiceAccount);
        expect(sa.subscriptions).toEqual([]);
      }
    });
  });

  describe('getSubscriptions()', () => {
    let subscriptionSpy: jest.SpyInstance;
    /**
     * Get a second OAuth server for the authentication
     */
    beforeEach(() => {
      subscriptionSpy = jest.spyOn(Subscription, 'get').mockResolvedValue(subscriptionSample);
    });

    it('SA10 - should get and store subscription', async () => {
      const serviceAccount: ServiceAccount = new ServiceAccount(baseUrl, {
        clientId: 'a',
        clientSecret: 'b',
        id: '1',
        createdAt: new Date().toISOString(),
      });

      await serviceAccount.getSubscriptions();
      expect(serviceAccount.subscriptions).toHaveLength(2);
      expect(subscriptionSpy).toHaveBeenCalled();
    });
  });

  describe('createSubscriptions()', () => {
    let subscriptionSpy: jest.SpyInstance;
    /**
     * Get a second OAuth server for the authentication
     */
    beforeEach(() => {
      subscriptionSpy = jest.spyOn(Subscription, 'create').mockResolvedValue(subscriptionSample[0]);
    });

    it('SA20 - should create and store subscription', async () => {
      const serviceAccount: ServiceAccount = new ServiceAccount(baseUrl, {
        clientId: 'a',
        clientSecret: 'b',
        id: '1',
        createdAt: new Date().toISOString(),
      });

      await serviceAccount.createSubscriptions([
        {
          target: 'http://...',
          eventName: EventName.APPLICATION_UPDATED,
        },
      ]);
      expect(serviceAccount.subscriptions).toHaveLength(1);
      expect(subscriptionSpy).toHaveBeenCalled();
    });
  });

  describe('getOrCreateSubscriptions()', () => {
    let createSubscriptionSpy: jest.SpyInstance;
    let getSubscriptionSpy: jest.SpyInstance;

    /**
     * Get a second OAuth server for the authentication
     */
    beforeEach(() => {
      createSubscriptionSpy = jest.spyOn(Subscription, 'create').mockResolvedValue(subscriptionSample[0]);
    });

    it('SA30 - should get and returns subscriptions', async () => {
      getSubscriptionSpy = jest.spyOn(Subscription, 'get').mockResolvedValue(subscriptionSample);

      const serviceAccount: ServiceAccount = new ServiceAccount(baseUrl, {
        clientId: 'a',
        clientSecret: 'b',
        id: '1',
        createdAt: new Date().toISOString(),
      });

      await serviceAccount.getOrCreateSubscriptions([
        {
          target: 'http://...',
          eventName: EventName.APPLICATION_UPDATED,
        },
      ]);
      expect(serviceAccount.subscriptions).toHaveLength(2);
      expect(getSubscriptionSpy).toHaveBeenCalled();
      expect(createSubscriptionSpy).not.toHaveBeenCalled();
    });

    it('SA31 - should get and create subscriptions', async () => {
      getSubscriptionSpy = jest.spyOn(Subscription, 'get').mockResolvedValue([]);

      const serviceAccount: ServiceAccount = new ServiceAccount(baseUrl, {
        clientId: 'a',
        clientSecret: 'b',
        id: '1',
        createdAt: new Date().toISOString(),
      });

      await serviceAccount.getOrCreateSubscriptions([
        {
          target: 'http://...',
          eventName: EventName.APPLICATION_UPDATED,
        },
      ]);
      expect(serviceAccount.subscriptions).toHaveLength(1);
      expect(getSubscriptionSpy).toHaveBeenCalled();
      expect(createSubscriptionSpy).toHaveBeenCalled();
    });

    it('SA32 - should get and update subscriptions', async () => {
      const mockUpdate: jest.Mock = jest.fn();
      getSubscriptionSpy = jest.spyOn(Subscription, 'get').mockResolvedValue([
        ({
          status: 'DISABLE',
          target: 'something',
          eventName: EventName.APPLICATION_UPDATED,
          id: '1',
          update: mockUpdate,
        } as unknown) as Subscription,
      ]);
      const serviceAccount: ServiceAccount = new ServiceAccount(baseUrl, {
        clientId: 'a',
        clientSecret: 'b',
        id: '1',
        createdAt: new Date().toISOString(),
      });

      await serviceAccount.getOrCreateSubscriptions([
        {
          target: 'http://...',
          eventName: EventName.APPLICATION_UPDATED,
        },
      ]);
      expect(serviceAccount.subscriptions).toHaveLength(1);
      expect(getSubscriptionSpy).toHaveBeenCalled();
      expect(createSubscriptionSpy).not.toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledWith({ status: 'ACTIVE' });
    });
  });

  describe('static getBanksUserById()', () => {
    let banksUserAPI: nock.Scope;
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
      banksUserAPI = getFakeAlgoanServer({
        baseUrl,
        path: '/v1/banks-users/id1',
        response: banksUserSample,
        method: 'get',
      });
    });
    it('should get the Banks User account', async () => {
      const serviceAccount: ServiceAccount = new ServiceAccount(baseUrl, {
        clientId: 'a',
        clientSecret: 'b',
        id: '1',
        createdAt: new Date().toISOString(),
      });
      const banksUser: BanksUser = await serviceAccount.getBanksUserById('id1');
      expect(banksUserAPI.isDone()).toBeTruthy();
      expect(banksUser).toBeInstanceOf(BanksUser);
    });
  });
});
