import * as nock from 'nock';

import { RequestBuilder } from '../src/RequestBuilder';
import { Holder, ISignature, Signature, SignatureState } from '../src';
import { getFakeAlgoanServer, getOAuthServer } from './utils/fake-server.utils';
import { folderSample } from './samples/folder';

describe('Tests related to the Application class', () => {
  const baseUrl: string = 'http://localhost:3000';
  let signatureAPI: nock.Scope;
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

  describe('static createSignature()', () => {
    beforeEach(() => {
      signatureAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/folders/${folderSample.id}/signatures`,
        response: {
          state: 0,
          legalDocumentIds: ['random_legal_id'],
          id: '5f3663fc3ec5884afc8ed04f',
          partnerId: 'SIGN_ID',
          holder: 'APPLICANT',
          createdAt: 1560675749902,
        },
        method: 'post',
      });
    });
    it('should create a signature', async () => {
      const signature: ISignature = await Signature.create(requestBuilder, folderSample.id, {
        partnerId: 'SIGN_ID',
        legalDocumentIds: ['random_legal_id'],
        holder: Holder.APPLICANT,
      });
      expect(signatureAPI.isDone()).toBeTruthy();
      expect(signature).toBeInstanceOf(Signature);
      expect(signature.id).toEqual('5f3663fc3ec5884afc8ed04f');
      expect(signature.legalDocumentIds).toEqual(['random_legal_id']);
      expect(signature.partnerId).toEqual('SIGN_ID');
      expect(signature.holder).toEqual('APPLICANT');
      expect(signature.createdAt).toEqual(1560675749902);
    });
  });

  describe('static getById()', () => {
    beforeEach(() => {
      signatureAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/folders/${folderSample.id}/signatures/${folderSample.signatures[0].id}`,
        response: folderSample.signatures[0],
        method: 'get',
      });
    });
    it('should get a signature', async () => {
      const signature: ISignature = await Signature.getById(requestBuilder, {
        folderId: folderSample.id,
        signatureId: folderSample.signatures[0].id,
      });
      expect(signatureAPI.isDone()).toBeTruthy();
      expect(signature).toBeInstanceOf(Signature);
      expect(signature.id).toEqual(folderSample.signatures[0].id);
      expect(signature.legalDocumentIds).toEqual(folderSample.signatures[0].legalDocumentIds);
      expect(signature.partnerId).toEqual(folderSample.signatures[0].partnerId);
      expect(signature.holder).toEqual(folderSample.signatures[0].holder);
      expect(signature.createdAt).toEqual(folderSample.signatures[0].createdAt);
    });
  });

  describe('update()', () => {
    beforeEach(() => {
      signatureAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/folders/${folderSample.id}/signatures/${folderSample.signatures[0].id}`,
        response: { ...folderSample.signatures[0], state: SignatureState.SIGNED },
        method: 'patch',
      });
    });
    it('should update the Signature', async () => {
      const signature: Signature = new Signature(folderSample.id, folderSample.signatures[0], requestBuilder);

      await signature.update({
        state: SignatureState.SIGNED,
      });

      expect(signatureAPI.isDone()).toBeTruthy();
      expect(signature.state).toEqual(4);
    });
  });
});
