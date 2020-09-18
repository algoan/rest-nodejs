import * as nock from 'nock';

import { RequestBuilder } from '../src/RequestBuilder';
import { ServiceAccount } from '../src/core/ServiceAccount';
import { Subscription } from '../src/core/Subscription';
import { BanksUser } from '../src/core/BanksUser';
import { EventName, Holder, Signature } from '../src';
import { getFakeAlgoanServer, getOAuthServer } from './utils/fake-server.utils';
import { serviceAccounts as serviceAccountsSample } from './samples/service-accounts';
import { subscriptions as subscriptionSample } from './samples/subscriptions';
import { banksUser as banksUserSample } from './samples/banks-users';
import { applicationSample } from './samples/application';
import { Application } from '../src/core/Application';
import { folderSample } from './samples/folder';
import {
  legalDocumentSample,
  legalFileSample,
  newLegalDocuments,
  postLegalDocumentsResponse,
} from './samples/legal-document';

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

  describe('getAuthorizationHeader', () => {
    it('SA40 - should get the authorization header', async () => {
      const serviceAccount: ServiceAccount = new ServiceAccount(baseUrl, {
        clientId: 'a',
        clientSecret: 'b',
        id: '1',
        createdAt: new Date().toISOString(),
      });

      const token: string = await serviceAccount.getAuthorizationHeader();

      expect(token).toEqual('Bearer fake_access_token');
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

  describe('static getApplicationById()', () => {
    let applicationAPI: nock.Scope;
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
      applicationAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/applications/${applicationSample.id}`,
        response: applicationSample,
        method: 'get',
      });
    });
    it('should get the Application', async () => {
      const serviceAccount: ServiceAccount = new ServiceAccount(baseUrl, {
        clientId: 'a',
        clientSecret: 'b',
        id: '1',
        createdAt: new Date().toISOString(),
      });
      const application: Application = await serviceAccount.getApplicationById(applicationSample.id);
      expect(applicationAPI.isDone()).toBeTruthy();
      expect(application).toBeInstanceOf(Application);
    });
  });

  describe('static createSignature()', () => {
    let signatureAPI: nock.Scope;
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
      signatureAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/folders/${folderSample.id}/signatures`,
        response: {
          elements: [{ resource: folderSample.signatures[0] }],
          metadata: { failure: 0, success: 1, total: 1 },
        },
        method: 'post',
      });
    });
    it('should create a new Signature', async () => {
      const serviceAccount: ServiceAccount = new ServiceAccount(baseUrl, {
        clientId: 'a',
        clientSecret: 'b',
        id: '1',
        createdAt: new Date().toISOString(),
      });
      const signatures = await serviceAccount.createSignature(folderSample.id, [
        {
          partnerId: 'provider_id',
          legalDocumentIds: ['doc_id'],
          holder: Holder.APPLICANT,
        },
      ]);
      const signature = signatures.elements[0].resource;
      expect(signatureAPI.isDone()).toBeTruthy();
      expect(signature).toBeInstanceOf(Signature);
    });
  });

  describe('static getSignatureById()', () => {
    let signatureAPI: nock.Scope;
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
      signatureAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/folders/${folderSample.id}/signatures/${folderSample.signatures[0].id}`,
        response: folderSample.signatures[0],
        method: 'get',
      });
    });
    it('should get a Signature', async () => {
      const serviceAccount: ServiceAccount = new ServiceAccount(baseUrl, {
        clientId: 'a',
        clientSecret: 'b',
        id: '1',
        createdAt: new Date().toISOString(),
      });
      const signature: Signature = await serviceAccount.getSignatureById({
        folderId: folderSample.id,
        signatureId: folderSample.signatures[0].id,
      });
      expect(signatureAPI.isDone()).toBeTruthy();
      expect(signature).toBeInstanceOf(Signature);
    });
  });

  describe('createLegalDocuments()', () => {
    let folderAPI: nock.Scope;
    beforeEach(() => {
      folderAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/folders/${folderSample.id}/legal-documents`,
        response: postLegalDocumentsResponse,
        method: 'post',
      });
    });
    it('should create legal documents', async () => {
      const serviceAccount: ServiceAccount = new ServiceAccount(baseUrl, {
        clientId: 'a',
        clientSecret: 'b',
        id: '1',
        createdAt: new Date().toISOString(),
      });
      await serviceAccount.createLegalDocuments(folderSample.id, newLegalDocuments);

      expect(folderAPI.isDone()).toBeTruthy();
    });
  });

  describe('getLegalFileById()', () => {
    let folderAPI: nock.Scope;
    beforeEach(() => {
      folderAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/folders/${folderSample.id}/legal-documents/${legalDocumentSample.id}/files/${legalFileSample.id}`,
        response: postLegalDocumentsResponse,
        method: 'get',
      });
    });
    it('should fetch the specified file', async () => {
      const serviceAccount: ServiceAccount = new ServiceAccount(baseUrl, {
        clientId: 'a',
        clientSecret: 'b',
        id: '1',
        createdAt: new Date().toISOString(),
      });

      await serviceAccount.getLegalFileById({
        folderId: folderSample.id,
        legalDocumentId: legalDocumentSample.id,
        fileId: legalFileSample.id,
      });

      expect(folderAPI.isDone()).toBeTruthy();
    });
  });
});
