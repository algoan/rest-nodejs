import * as nock from 'nock';

const fakeAccessToken: string = 'fake_access_token';
/**
 * Return a fake oAuth server
 * @param baseUrl Base url
 */
export const getOAuthServer = (
  params: {
    baseUrl: string;
    isRefreshToken: boolean;
    nbOfCalls: number;
    isUserPassword: boolean;
    expiresIn?: number;
    refreshExpiresIn?: number;
  } = {
    baseUrl: 'http://localhost:3000',
    isRefreshToken: false,
    isUserPassword: false,
    nbOfCalls: 1,
  },
): nock.Scope => {
  const responseBody: Record<string, any> = {
    refresh_token: 'b',
    expires_in: params.expiresIn ?? 0.03,
    refresh_expires_in: params.refreshExpiresIn ?? 1,
    access_token: fakeAccessToken,
  };
  responseBody.grant_type = params.isRefreshToken ? 'refresh_token' : 'client_credentials';

  const isRequestBodyValid = (body: { grant_type: string }) => {
    if (params.isUserPassword) {
      return body.grant_type === 'password';
    }

    return params.isRefreshToken ? body.grant_type === 'refresh_token' : body.grant_type === 'client_credentials';
  };

  let nockInstance: nock.Interceptor = nock(params.baseUrl).post('/v1/oauth/token', isRequestBodyValid);

  if (params.nbOfCalls > 1) {
    nockInstance = nockInstance.times(params.nbOfCalls);
  }

  return nockInstance.reply(200, responseBody);
};

/**
 * Fake GET /service-accounts API
 * @param baseUrl
 */
export const getFakeAlgoanServer = (params: {
  baseUrl: string;
  method: 'get' | 'post' | 'patch';
  path: string;
  response: Record<string, any>;
  nbOfCalls?: number;
  status?: number;
  authorization?: string;
}): nock.Scope =>
  nock(params.baseUrl, {
    reqheaders: {
      authorization: params.authorization ?? `Bearer ${fakeAccessToken}`,
    },
  })
    [params.method](params.path)
    .times(params.nbOfCalls ?? 1)
    .reply(params.status ?? 200, params.response);
