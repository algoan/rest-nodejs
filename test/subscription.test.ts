import { createHmac } from 'crypto';
import * as nock from 'nock';

import { RequestBuilder } from '../src/RequestBuilder';
import { Subscription } from '../src/core/Subscription';
import { EventName } from '../src';
import { getOAuthServer, getFakeAlgoanServer } from './utils/fake-server.utils';
import { subscriptions as subscriptionsSample } from './samples/subscriptions';

describe('Tests related to the Subscription class', () => {
  describe('static get()', () => {
    const baseUrl: string = 'http://localhost:3000';
    let subscriptionAPI: nock.Scope;
    let requestBuilder: RequestBuilder;

    beforeEach(() => {
      subscriptionAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/subscriptions?filter=${JSON.stringify({
          eventName: {
            $in: [EventName.APPLICATION_UPDATED, EventName.BANKREADER_COMPLETED],
          },
        })}`,
        response: subscriptionsSample,
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

    it('SB001 - should get subscriptions', async () => {
      const subscriptions: Subscription[] = await Subscription.get(requestBuilder, [
        EventName.APPLICATION_UPDATED,
        EventName.BANKREADER_COMPLETED,
      ]);
      expect(subscriptionAPI.isDone()).toBeTruthy();

      for (const sb of subscriptions) {
        expect(sb).toBeInstanceOf(Subscription);
      }
    });
    it('SB002 - should get subscriptions (whithout event name filter)', async () => {
      subscriptionAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/subscriptions`,
        response: subscriptionsSample,
        method: 'get',
      });

      const subscriptions: Subscription[] = await Subscription.get(requestBuilder, []);
      expect(subscriptionAPI.isDone()).toBeTruthy();

      for (const sb of subscriptions) {
        expect(sb).toBeInstanceOf(Subscription);
      }
    });
  });

  describe('static create()', () => {
    const baseUrl: string = 'http://localhost:3000';
    let subscriptionAPI: nock.Scope;
    let requestBuilder: RequestBuilder;

    beforeEach(() => {
      subscriptionAPI = getFakeAlgoanServer({
        baseUrl,
        path: '/v1/subscriptions',
        response: subscriptionsSample[0],
        method: 'post',
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

    it('SB010 - should create subscription', async () => {
      const subscription: Subscription = await Subscription.create(requestBuilder, {
        target: 'https://...',
        eventName: EventName.APPLICATION_UPDATED,
      });
      expect(subscriptionAPI.isDone()).toBeTruthy();
      expect(subscription).toBeInstanceOf(Subscription);
    });
  });

  describe('update()', () => {
    const baseUrl: string = 'http://localhost:3000';
    let subscriptionAPI: nock.Scope;
    let requestBuilder: RequestBuilder;

    beforeEach(() => {
      subscriptionAPI = getFakeAlgoanServer({
        baseUrl,
        path: '/v1/subscriptions/1',
        response: subscriptionsSample[0],
        method: 'patch',
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

    it('SB020 - should update a subscription', async () => {
      const subscription: Subscription = new Subscription(
        {
          target: baseUrl,
          id: '1',
          eventName: EventName.APPLICATION_UPDATED,
          status: 'DISABLE',
        },
        requestBuilder,
      );

      await subscription.update({
        status: 'ACTIVE',
      });

      expect(subscriptionAPI.isDone()).toBeTruthy();
      expect(subscription.status).toEqual('ACTIVE');
    });
  });

  describe('validateSignature()', () => {
    const baseUrl: string = 'http://localhost:3000';
    let requestBuilder: RequestBuilder;
    const secret: string = 'random_secret';
    const fakePayloadSent: {} = {
      banksUserId: 'id',
    };
    const hash: string = `sha256=${createHmac('sha256', secret).update(JSON.stringify(fakePayloadSent)).digest('hex')}`;

    beforeEach(() => {
      requestBuilder = new RequestBuilder(baseUrl, {
        clientId: 'a',
        clientSecret: 's',
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
      nock.cleanAll();
    });
    it('SB030 - should be valid - no secret defined', () => {
      const subscription: Subscription = new Subscription(
        {
          target: baseUrl,
          id: '1',
          eventName: EventName.APPLICATION_UPDATED,
          status: 'DISABLE',
        },
        requestBuilder,
      );

      expect(subscription.validateSignature(hash, fakePayloadSent)).toBeTruthy();
    });

    it('SB031 - should be valid', () => {
      const subscription: Subscription = new Subscription(
        {
          target: baseUrl,
          id: '1',
          eventName: EventName.APPLICATION_UPDATED,
          status: 'DISABLE',
          secret,
        },
        requestBuilder,
      );

      expect(subscription.validateSignature(hash, fakePayloadSent)).toBeTruthy();
    });

    it('SB032 - should not be valid', () => {
      const subscription: Subscription = new Subscription(
        {
          target: baseUrl,
          id: '1',
          eventName: EventName.APPLICATION_UPDATED,
          status: 'DISABLE',
          secret: 'other_secret',
        },
        requestBuilder,
      );

      expect(subscription.validateSignature(hash, fakePayloadSent)).toBeFalsy();
    });
  });
});
