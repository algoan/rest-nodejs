import * as delay from 'delay';
import * as nock from 'nock';

import { RequestBuilder } from '../src/RequestBuilder';
import { getOAuthServer, getFakeAlgoanServer } from './utils/fake-server.utils';
import { Logger, createLogger, transports } from 'winston';

const defaultLogger: Logger = createLogger({
  transports: [
    new transports.Console({
      level: 'info',
      stderrLevels: ['error'],
      consoleWarnLevels: ['warn'],
    }),
  ],
});

describe('Tests related to the RequestBuilder class', () => {
  const baseUrl: string = 'http://localhost:3000';
  let infoLogSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    infoLogSpy = jest.spyOn(defaultLogger, 'info');
    errorSpy = jest.spyOn(defaultLogger, 'error');
  });

  afterEach(() => {
    jest.resetAllMocks();
    nock.cleanAll();
  });

  it('RB001 - should call the token API once', async () => {
    const requestBuilder: RequestBuilder = new RequestBuilder(baseUrl, {
      clientId: 'clientId',
      clientSecret: 'clientSecret',
    });
    const oAuthServer: nock.Scope = getOAuthServer({
      baseUrl,
      isRefreshToken: false,
      isUserPassword: false,
      nbOfCalls: 1,
    });
    const randomAlgoanServer: nock.Scope = getFakeAlgoanServer({
      baseUrl,
      method: 'get',
      path: '/',
      response: [],
    });

    await requestBuilder.request({
      method: 'GET',
      url: '/',
    });

    expect(oAuthServer.isDone()).toBeTruthy();
    expect(randomAlgoanServer.isDone()).toBeTruthy();
    expect((requestBuilder as any).accessTokenInstance).toBeDefined();
  });

  it('RB001a - should call the token API the next version', async () => {
    const requestBuilder: RequestBuilder = new RequestBuilder(
      baseUrl,
      {
        clientId: 'clientId',
        clientSecret: 'clientSecret',
      },
      {
        version: 2,
      },
    );
    const oAuthServer: nock.Scope = getOAuthServer({
      baseUrl,
      isRefreshToken: false,
      isUserPassword: false,
      nbOfCalls: 1,
      version: 2,
    });
    const randomAlgoanServer: nock.Scope = getFakeAlgoanServer({
      baseUrl,
      method: 'get',
      path: '/',
      response: [],
    });

    await requestBuilder.request({
      method: 'GET',
      url: '/',
    });

    expect(oAuthServer.isDone()).toBeTruthy();
    expect(randomAlgoanServer.isDone()).toBeTruthy();
    expect((requestBuilder as any).accessTokenInstance).toBeDefined();
  });

  it('RB002 - should call the token API twice - refresh token', async () => {
    const requestBuilder: RequestBuilder = new RequestBuilder(baseUrl, {
      clientId: 'clientId',
      clientSecret: 'clientSecret',
    });
    const oAuthServer: nock.Scope = getOAuthServer({
      baseUrl,
      isRefreshToken: false,
      isUserPassword: false,
      nbOfCalls: 1,
      expiresIn: 0.05,
      refreshExpiresIn: 1000,
    });
    const refreshTokenServer: nock.Scope = getOAuthServer({
      baseUrl,
      isRefreshToken: true,
      isUserPassword: false,
      nbOfCalls: 1,
    });
    const randomAlgoanServer: nock.Scope = getFakeAlgoanServer({
      baseUrl,
      method: 'get',
      path: '/',
      response: [],
      nbOfCalls: 2,
    });

    await requestBuilder.request({
      method: 'GET',
      url: '/',
    });

    expect(oAuthServer.isDone()).toBeTruthy();
    expect(randomAlgoanServer.isDone()).toBeFalsy();
    expect((requestBuilder as any).accessTokenInstance).toBeDefined();
    expect(refreshTokenServer.isDone()).toBeFalsy();

    await delay(500);

    await requestBuilder.request({
      method: 'GET',
      url: '/',
    });
    expect(refreshTokenServer.isDone()).toBeTruthy();
    expect(randomAlgoanServer.isDone()).toBeTruthy();
  });

  it('RB003 - should call the token API once - access token instance existing', async () => {
    const requestBuilder: RequestBuilder = new RequestBuilder(baseUrl, {
      clientId: 'clientId',
      clientSecret: 'clientSecret',
    });
    const oAuthServer: nock.Scope = getOAuthServer({
      baseUrl,
      isRefreshToken: false,
      isUserPassword: false,
      nbOfCalls: 1,
      expiresIn: 500,
      refreshExpiresIn: 2000,
    });
    const randomAlgoanServer: nock.Scope = getFakeAlgoanServer({
      baseUrl,
      method: 'get',
      path: '/',
      response: [],
      nbOfCalls: 2,
    });

    await requestBuilder.request({
      method: 'GET',
      url: '/',
    });

    expect(oAuthServer.isDone()).toBeTruthy();
    expect(randomAlgoanServer.isDone()).toBeFalsy();
    expect((requestBuilder as any).accessTokenInstance).toBeDefined();

    await requestBuilder.request({
      method: 'GET',
      url: '/',
    });
    expect(randomAlgoanServer.isDone()).toBeTruthy();
  });

  it('RB004 - should call the token API once - username/password', async () => {
    const requestBuilder: RequestBuilder = new RequestBuilder(baseUrl, {
      clientId: 'clientId',
      username: 'user',
      password: 'password',
    });
    const oAuthServer: nock.Scope = getOAuthServer({
      baseUrl,
      isRefreshToken: false,
      isUserPassword: true,
      nbOfCalls: 1,
    });
    const randomAlgoanServer: nock.Scope = getFakeAlgoanServer({
      baseUrl,
      method: 'get',
      path: '/',
      response: [],
    });

    await requestBuilder.request({
      method: 'GET',
      url: '/',
    });

    expect(oAuthServer.isDone()).toBeTruthy();
    expect(randomAlgoanServer.isDone()).toBeTruthy();
    expect((requestBuilder as any).accessTokenInstance).toBeDefined();
  });

  it('RB005 - should correctly log information', async () => {
    const requestBuilder: RequestBuilder = new RequestBuilder(
      baseUrl,
      {
        clientId: 'clientId',
        clientSecret: 'clientSecret',
      },
      {
        debug: true,
        logger: defaultLogger,
      },
    );
    const oAuthServer: nock.Scope = getOAuthServer({
      baseUrl,
      isRefreshToken: false,
      isUserPassword: false,
      nbOfCalls: 2,
      expiresIn: 0,
      refreshExpiresIn: 0,
    });
    const randomAlgoanServer: nock.Scope = getFakeAlgoanServer({
      baseUrl,
      method: 'get',
      path: '/',
      response: [],
      nbOfCalls: 2,
    });

    await requestBuilder.request({
      method: 'GET',
      url: '/',
    });

    expect(oAuthServer.isDone()).toBeFalsy();
    expect(randomAlgoanServer.isDone()).toBeFalsy();
    expect((requestBuilder as any).accessTokenInstance).toBeDefined();
    expect((requestBuilder as any).axiosInstance.interceptors.request.handlers).toHaveLength(2);
    expect((requestBuilder as any).axiosInstance.interceptors.response.handlers).toHaveLength(1);
    expect(infoLogSpy).toHaveBeenCalledTimes(2);
  });

  it('RB006 - should correctly log an error', async () => {
    const requestBuilder: RequestBuilder = new RequestBuilder(
      baseUrl,
      {
        clientId: 'clientId',
        clientSecret: 'clientSecret',
      },
      {
        debug: true,
        logger: defaultLogger,
      },
    );
    const oAuthServer: nock.Scope = getOAuthServer({
      baseUrl,
      isRefreshToken: false,
      isUserPassword: false,
      nbOfCalls: 2,
      expiresIn: 0,
      refreshExpiresIn: 0,
    });
    const randomAlgoanServer: nock.Scope = getFakeAlgoanServer({
      baseUrl,
      method: 'get',
      path: '/',
      response: [],
      nbOfCalls: 2,
      status: 404,
    });

    await expect(
      requestBuilder.request({
        method: 'GET',
        url: '/',
      }),
    ).rejects.toThrowError();

    expect(oAuthServer.isDone()).toBeFalsy();
    expect(randomAlgoanServer.isDone()).toBeFalsy();
    expect((requestBuilder as any).accessTokenInstance).toBeDefined();
    expect((requestBuilder as any).axiosInstance.interceptors.request.handlers).toHaveLength(2);
    expect((requestBuilder as any).axiosInstance.interceptors.response.handlers).toHaveLength(1);
    expect(infoLogSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('RB007 - should have no log', async () => {
    const requestBuilder: RequestBuilder = new RequestBuilder(
      baseUrl,
      {
        clientId: 'clientId',
        clientSecret: 'clientSecret',
      },
      {
        debug: true,
      },
    );
    const oAuthServer: nock.Scope = getOAuthServer({
      baseUrl,
      isRefreshToken: false,
      isUserPassword: false,
      nbOfCalls: 2,
      expiresIn: 0,
      refreshExpiresIn: 0,
    });
    const randomAlgoanServer: nock.Scope = getFakeAlgoanServer({
      baseUrl,
      method: 'get',
      path: '/',
      response: [],
      nbOfCalls: 2,
    });

    await requestBuilder.request({
      method: 'GET',
      url: '/',
    });

    expect(oAuthServer.isDone()).toBeFalsy();
    expect(randomAlgoanServer.isDone()).toBeFalsy();
    expect((requestBuilder as any).accessTokenInstance).toBeDefined();
    expect((requestBuilder as any).axiosInstance.interceptors.request.handlers).toHaveLength(1);
    expect((requestBuilder as any).axiosInstance.interceptors.response.handlers).toHaveLength(0);
    expect(infoLogSpy).toHaveBeenCalledTimes(0);
  });

  it('RB008 - should not display logs', async () => {
    const requestBuilder: RequestBuilder = new RequestBuilder(
      baseUrl,
      {
        clientId: 'clientId',
        clientSecret: 'clientSecret',
      },
      {
        debug: false,
        logger: defaultLogger,
      },
    );
    const oAuthServer: nock.Scope = getOAuthServer({
      baseUrl,
      isRefreshToken: false,
      isUserPassword: false,
      nbOfCalls: 2,
      expiresIn: 0,
      refreshExpiresIn: 0,
    });
    const randomAlgoanServer: nock.Scope = getFakeAlgoanServer({
      baseUrl,
      method: 'get',
      path: '/',
      response: [],
      nbOfCalls: 2,
      status: 404,
    });

    await expect(
      requestBuilder.request({
        method: 'GET',
        url: '/',
      }),
    ).rejects.toThrowError();

    expect(oAuthServer.isDone()).toBeFalsy();
    expect(randomAlgoanServer.isDone()).toBeFalsy();
    expect((requestBuilder as any).accessTokenInstance).toBeDefined();
    expect((requestBuilder as any).axiosInstance.interceptors.request.handlers).toHaveLength(1);
    expect((requestBuilder as any).axiosInstance.interceptors.response.handlers).toHaveLength(0);
    expect(infoLogSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it('RB009 - should call the token API once - authorization in configs', async () => {
    const authorization: string = 'Bearer accesstoken';
    const requestBuilder: RequestBuilder = new RequestBuilder(baseUrl, {
      clientId: 'clientId',
    });
    const oAuthServer: nock.Scope = getOAuthServer({
      baseUrl,
      isRefreshToken: false,
      isUserPassword: true,
      nbOfCalls: 1,
    });
    const randomAlgoanServer: nock.Scope = getFakeAlgoanServer({
      baseUrl,
      method: 'get',
      path: '/',
      response: [],
      authorization,
    });

    await requestBuilder.request({
      method: 'GET',
      url: '/',
      headers: { Authorization: authorization },
    });

    expect(oAuthServer.isDone()).toBeFalsy();
    expect(randomAlgoanServer.isDone()).toBeTruthy();
    expect((requestBuilder as any).accessTokenInstance).toBeUndefined();
    expect((requestBuilder as any).authorizationHeader).toBeUndefined();
  });

  it('RB010 - should call the token API once - set the authorization', async () => {
    const authorization: string = 'Bearer accesstoken';
    const requestBuilder: RequestBuilder = new RequestBuilder(baseUrl, {
      clientId: 'clientId',
    });
    const oAuthServer: nock.Scope = getOAuthServer({
      baseUrl,
      isRefreshToken: false,
      isUserPassword: true,
      nbOfCalls: 1,
    });
    const randomAlgoanServer: nock.Scope = getFakeAlgoanServer({
      baseUrl,
      method: 'get',
      path: '/',
      response: [],
      authorization,
    });
    requestBuilder.authorizationHeader = authorization;

    await requestBuilder.request({
      method: 'GET',
      url: '/',
    });

    expect(oAuthServer.isDone()).toBeFalsy();
    expect(randomAlgoanServer.isDone()).toBeTruthy();
    expect((requestBuilder as any).accessTokenInstance).toBeUndefined();
    expect((requestBuilder as any)._authorizationHeader).toBeDefined();
  });

  it('RB011 - should call the token API once - authorization in RequestBuilder constructor', async () => {
    const authorization: string = 'Bearer accesstoken';
    const requestBuilder: RequestBuilder = new RequestBuilder(
      baseUrl,
      {
        clientId: 'clientId',
      },
      {},
      authorization,
    );
    const oAuthServer: nock.Scope = getOAuthServer({
      baseUrl,
      isRefreshToken: false,
      isUserPassword: true,
      nbOfCalls: 1,
    });
    const randomAlgoanServer: nock.Scope = getFakeAlgoanServer({
      baseUrl,
      method: 'get',
      path: '/',
      response: [],
      authorization,
    });

    await requestBuilder.request({
      method: 'GET',
      url: '/',
    });

    expect(oAuthServer.isDone()).toBeFalsy();
    expect(randomAlgoanServer.isDone()).toBeTruthy();
    expect((requestBuilder as any).accessTokenInstance).toBeUndefined();
    expect((requestBuilder as any)._authorizationHeader).toBeDefined();
  });

  it('RB012 - should call the token API twice - error on refresh', async () => {
    const requestBuilder: RequestBuilder = new RequestBuilder(baseUrl, {
      clientId: 'clientId',
      clientSecret: 'clientSecret',
    });
    const oAuthServer: nock.Scope = getOAuthServer({
      baseUrl,
      isRefreshToken: false,
      isUserPassword: false,
      nbOfCalls: 2,
      expiresIn: 0.05,
      refreshExpiresIn: 1000,
    });
    const refreshTokenServer: nock.Scope = getOAuthServer({
      baseUrl,
      isRefreshToken: true,
      isUserPassword: false,
      nbOfCalls: 1,
      error: 'an error occured',
    });
    const randomAlgoanServer: nock.Scope = getFakeAlgoanServer({
      baseUrl,
      method: 'get',
      path: '/',
      response: [],
      nbOfCalls: 2,
    });

    await requestBuilder.request({
      method: 'GET',
      url: '/',
    });

    expect(oAuthServer.isDone()).toBeFalsy();
    expect(randomAlgoanServer.isDone()).toBeFalsy();
    expect((requestBuilder as any).accessTokenInstance).toBeDefined();
    expect(refreshTokenServer.isDone()).toBeFalsy();

    await delay(500);

    await requestBuilder.request({
      method: 'GET',
      url: '/',
    });
    expect(refreshTokenServer.isDone()).toBeTruthy();
    expect(oAuthServer.isDone()).toBeTruthy();
    expect(randomAlgoanServer.isDone()).toBeTruthy();
  });
});
