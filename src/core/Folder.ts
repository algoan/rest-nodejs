import { IFolder, FolderState } from '../lib';
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

  constructor(params: IFolder) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.expiredAt = params.expiredAt;
    this.updatedAt = params.updatedAt;
    this.lastFileUploadedAt = params.lastFileUploadedAt;
    this.signatures = params.signatures;
    this.state = params.state;
    this.legalDocuments = params.legalDocuments.map((doc) => new LegalDocument(doc));
    this.supportingDocuments = params.supportingDocuments.map((doc) => new SupportingDocument(doc));
  }
}
