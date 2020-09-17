import { IFolder, FolderState, PostLegalDocumentDTO, MultiResourceCreationResponse, LegalFile } from '../lib';
import { RequestBuilder } from '../RequestBuilder';
import { LegalDocument } from './LegalDocument';
import { SupportingDocument } from './SupportingDocument';
import { Signature } from '.';

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

  /**
   * Signature instances attached to the folder
   */
  public signatures: Signature[];

  /**
   * Define the global folder status
   */
  public state: FolderState;

  public supportingDocuments: SupportingDocument[];

  constructor(params: IFolder, private readonly requestBuilder: RequestBuilder) {
    this.id = params.id;
    this.createdAt = new Date(params.createdAt);
    this.expiredAt = new Date(params.expiredAt);
    this.updatedAt = new Date(params.updatedAt);
    this.lastFileUploadedAt = params.lastFileUploadedAt ? new Date(params.lastFileUploadedAt) : undefined;
    this.signatures = params.signatures?.map((signature) => new Signature(this.id, signature, requestBuilder)) ?? [];
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
    const response = await LegalDocument.create(this.requestBuilder, this.id, documents);
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
