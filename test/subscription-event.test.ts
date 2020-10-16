import * as nock from 'nock';

import { RequestBuilder } from '../src/RequestBuilder';
import { SubscriptionEvent } from '../src/core/SubscriptionEvent';
import { EventStatus, ISubscriptionEvent } from '../src';
import { getOAuthServer, getFakeAlgoanServer } from './utils/fake-server.utils';
import { subscriptionEvents as subscriptionEventsSample } from './samples/subscriptions-events';

describe('Tests related to the SubscriptionEvent class', () => {
  describe('static get()', () => {
    const baseUrl: string = 'http://localhost:3000';
    let subscriptionEventAPI: nock.Scope;
    let requestBuilder: RequestBuilder;
    let subscriptionId: string = 'subscriptionId';
    let applicationId: string = 'applicationId';

    beforeEach(() => {
      subscriptionEventAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/subscriptions/${subscriptionId}/events?applicationId=${applicationId}`,
        response: subscriptionEventsSample,
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

    it("SE001 - should get subscription's event", async () => {
      const subscriptionsEvent: ISubscriptionEvent[] = await SubscriptionEvent.get(requestBuilder, subscriptionId, {
        applicationId,
      });
      expect(subscriptionEventAPI.isDone()).toBeTruthy();
      expect(subscriptionsEvent.length).toBeDefined();
    });
  });

  describe('update()', () => {
    const baseUrl: string = 'http://localhost:3000';
    let subscriptionEventAPI: nock.Scope;
    let requestBuilder: RequestBuilder;
    let subscriptionId: string = 'subscriptionId';
    let eventId: string = 'eventId';

    beforeEach(() => {
      subscriptionEventAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/subscriptions/${subscriptionId}/events/${eventId}`,
        response: subscriptionEventsSample[0],
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

    it("SE020 - should update a subscription's event status", async () => {
      const subscriptionEvent: SubscriptionEvent = new SubscriptionEvent(
        {
          eventId,
          subscriptionId,
        },
        requestBuilder,
      );

      await subscriptionEvent.update({
        status: EventStatus.ACK,
      });

      expect(subscriptionEventAPI.isDone()).toBeTruthy();
    });
  });
});
