import * as nock from 'nock';

import { RequestBuilder } from '../src/RequestBuilder';
import { getFakeAlgoanServer, getOAuthServer } from './utils/fake-server.utils';
import { folderSample } from './samples/folder';
import { LegalDocument } from '../src';
import {
  fileToUploadWithMedia,
  fileToUploadWithoutMedia,
  legalDocumentSample,
  legalFileSample,
  newLegalDocuments,
  postLegalDocumentsResponse,
} from './samples/legal-document';

describe('Tests related to the LegalDocument class', () => {
  const baseUrl: string = 'http://localhost:3000';
  let legalDocumentAPI: nock.Scope;
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

  describe('static createLegalDocuments()', () => {
    beforeEach(() => {
      legalDocumentAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/folders/${folderSample.id}/legal-documents`,
        response: postLegalDocumentsResponse,
        method: 'post',
      });
    });
    it('should create legal documents', async () => {
      await LegalDocument.create(requestBuilder, folderSample.id, newLegalDocuments);

      expect(legalDocumentAPI.isDone()).toBeTruthy();
    });
  });

  describe('static getFileById()', () => {
    beforeEach(() => {
      legalDocumentAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/folders/${folderSample.id}/legal-documents/${legalDocumentSample.id}/files/${legalFileSample.id}`,
        response: postLegalDocumentsResponse,
        method: 'get',
      });
    });
    it('should fetch the specified file', async () => {
      await LegalDocument.getFileById(requestBuilder, {
        folderId: folderSample.id,
        legalDocumentId: legalDocumentSample.id,
        fileId: legalFileSample.id,
      });

      expect(legalDocumentAPI.isDone()).toBeTruthy();
    });
  });

  describe('static getById()', () => {
    beforeEach(() => {
      legalDocumentAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/folders/${folderSample.id}/legal-documents/${legalDocumentSample.id}`,
        response: legalDocumentSample,
        method: 'get',
      });
    });
    it('should fetch the specified file', async () => {
      await LegalDocument.getById(requestBuilder, {
        folderId: folderSample.id,
        legalDocumentId: legalDocumentSample.id,
      });

      expect(legalDocumentAPI.isDone()).toBeTruthy();
    });
  });

  describe('uploadFile()', () => {
    beforeEach(() => {
      legalDocumentAPI = getFakeAlgoanServer({
        baseUrl,
        path: `/v1/folders/${folderSample.id}/legal-documents/${legalDocumentSample.id}/files`,
        response: legalFileSample,
        method: 'post',
      });
    });

    it('should upload the given file if it does not contain file media', async () => {
      const legalDocument = new LegalDocument(legalDocumentSample, folderSample.id, requestBuilder);
      const nbOfFiles = legalDocument.files.length;
      await legalDocument.uploadFile(fileToUploadWithoutMedia);

      expect(legalDocumentAPI.isDone()).toBeTruthy();
      expect(legalDocument.files.length).toBe(nbOfFiles + 1);
    });

    it('should upload the given file if it contains file media', async () => {
      const legalDocument = new LegalDocument(legalDocumentSample, folderSample.id, requestBuilder);
      const nbOfFiles = legalDocument.files.length;
      await legalDocument.uploadFile(fileToUploadWithMedia);

      expect(legalDocumentAPI.isDone()).toBeTruthy();
      expect(legalDocument.files.length).toBe(nbOfFiles + 1);
    });
  });
});
