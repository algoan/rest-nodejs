import * as nock from 'nock';

import { RequestBuilder } from '../src/RequestBuilder';
import { ApplicationStatus } from '../src/lib';
import { Application } from '../src/core/Application';
import { getFakeAlgoanServer, getOAuthServer } from './utils/fake-server.utils';
import { applicationSample } from './samples/application';

describe('Tests related to the Application class', () => {
  const baseUrl: string = 'http://localhost:3000';
  let applicationAPI: nock.Scope;
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

  describe('static getApplicationById()', () => {
    beforeEach(() => {
      applicationAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/applications/${applicationSample.id}`,
        response: applicationSample,
        method: 'get',
      });
    });
    it('should get the application', async () => {
      const application: Application = await Application.getApplicationById('5f590f42b10afde077e204c4', requestBuilder);
      expect(applicationAPI.isDone()).toBeTruthy();
      expect(application).toBeInstanceOf(Application);
    });
  });

  describe('update()', () => {
    beforeEach(() => {
      applicationSample.status = ApplicationStatus.ACCEPTED;
      applicationSample.partnerId = 'partnerId';
      applicationAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/applications/${applicationSample.id}`,
        response: applicationSample,
        method: 'patch',
      });
    });
    it('should update the Application', async () => {
      applicationSample.status = ApplicationStatus.IN_PROGRESS;
      const application: Application = new Application(applicationSample, requestBuilder);

      await application.update({
        status: ApplicationStatus.ACCEPTED,
        partnerId: 'partnerId',
      });

      expect(applicationAPI.isDone()).toBeTruthy();
      expect(application.status).toEqual('ACCEPTED');
      expect(application.partnerId).toEqual('partnerId');
    });
  });
});
