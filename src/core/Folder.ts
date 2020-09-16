import { IFolder, FolderState, PostLegalDocumentDTO, MultiResourceCreationResponse, LegalFile } from '../lib';
import { RequestBuilder } from '../RequestBuilder';
import { LegalDocument } from './LegalDocument';
import { SupportingDocument } from './SupportingDocument';
import { Signature } from './Signature';

/**
 * Folder instance
 * Cf: https://developers.algoan.com/api/#operation/getFolder
 */
export class Folder implements IFolder {
  /**
   * Unique folder identifier
   */
  public id: string;

  /**
   * Folder expiration date
   */
  public expiredAt: Date;

  /**
   * Folder date of creation
   */
  public createdAt: Date;

  /**
   * Folder last update date
   */
  public updatedAt: Date;

  /**
   * Last file upload date
   */
  public lastFileUploadedAt?: Date;

  public legalDocuments: LegalDocument[];

  public signatures: Signature[];

  /**
   * Define the global folder status
   */
  public state: FolderState;

  public supportingDocuments: SupportingDocument[];

  constructor(params: IFolder, private readonly requestBuilder: RequestBuilder) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.expiredAt = params.expiredAt;
    this.updatedAt = params.updatedAt;
    this.lastFileUploadedAt = params.lastFileUploadedAt;
    this.signatures = params.signatures;
    this.state = params.state;
    this.legalDocuments = params.legalDocuments.map((doc) => new LegalDocument(doc, this.id, requestBuilder));
    this.supportingDocuments = params.supportingDocuments.map((doc) => new SupportingDocument(doc, this.id));
  }

  /**
   * Push a new legal documents in the folder's list of documents.
   * @param documents the new documents
   */
  public async createLegalDocuments(
    documents: PostLegalDocumentDTO[],
  ): Promise<MultiResourceCreationResponse<LegalDocument>> {
    const response = await LegalDocument.createLegalDocuments(this.requestBuilder, this.id, documents);
    this.legalDocuments.push(...response.elements.map((element) => element.resource));

    return response;
  }

  /**
   * Get one legal file from the current folder.
   * @param params the path parameters of the request
   */
  public async getLegalFileById(params: { legalDocumentId: string; fileId: string }): Promise<LegalFile> {
    return LegalDocument.getFileById(this.requestBuilder, { folderId: this.id, ...params });
  }
}