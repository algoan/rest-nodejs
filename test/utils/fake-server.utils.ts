import * as nock from 'nock';

const fakeAccessToken: string = 'fake_access_token';
/**
 * Return a fake oAuth server
 * @param baseUrl Base url
 */
export const getOAuthServer = (
  params: { baseUrl: string; isRefreshToken: boolean; nbOfCalls: number; isUserPassword: boolean } = {
    baseUrl: 'http://localhost:3000',
    isRefreshToken: false,
    isUserPassword: false,
    nbOfCalls: 1,
  },
): nock.Scope => {
  const responseBody: Record<string, any> = {
    refresh_token: 'b',
    expires_in: 0.03,
    refresh_expires_in: 1,
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
}): nock.Scope =>
  nock(params.baseUrl, {
    reqheaders: {
      authorization: `Bearer ${fakeAccessToken}`,
    },
  })
    [params.method](params.path)
    .reply(200, params.response);
