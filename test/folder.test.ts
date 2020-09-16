import * as nock from 'nock';

import { RequestBuilder } from '../src/RequestBuilder';
import { getFakeAlgoanServer, getOAuthServer } from './utils/fake-server.utils';
import { folderSample } from './samples/folder';
import { Folder } from '../src';
import {
  legalDocumentSample,
  legalFileSample,
  newLegalDocuments,
  postLegalDocumentsResponse,
} from './samples/legal-document';

describe('Tests related to the LegalDocument class', () => {
  const baseUrl: string = 'http://localhost:3000';
  let folderAPI: nock.Scope;
  let requestBuilder: RequestBuilder;
  let folder: Folder;

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

    folder = new Folder(folderSample, requestBuilder);
  });

  afterEach(() => {
    jest.clearAllMocks();
    nock.cleanAll();
  });

  describe('createLegalDocuments()', () => {
    beforeEach(() => {
      folderAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/folders/${folderSample.id}/legal-documents`,
        response: postLegalDocumentsResponse,
        method: 'post',
      });
    });
    it('should create legal documents', async () => {
      await folder.createLegalDocuments(newLegalDocuments);

      expect(folderAPI.isDone()).toBeTruthy();
    });
  });

  describe('getFileById()', () => {
    beforeEach(() => {
      folderAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/folders/${folderSample.id}/legal-documents/${legalDocumentSample.id}/files/${legalFileSample.id}`,
        response: postLegalDocumentsResponse,
        method: 'get',
      });
    });
    it('should fetch the specified file', async () => {
      await folder.getLegalFileById({
        legalDocumentId: legalDocumentSample.id,
        fileId: legalFileSample.id,
      });

      expect(folderAPI.isDone()).toBeTruthy();
    });
  });
});
