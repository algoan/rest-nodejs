import { ILegalDocument, LegalDocumentCategory, LegalFile, LegalFileType } from '../lib';
import { Document } from './Document';

/**
 * Legal document instance
 * Cf: https://developers.algoan.com/api/#operation/getLegalDocuments
 */
export class LegalDocument extends Document implements ILegalDocument {
  /**
   * Category of the legal document
   */
  public category: LegalDocumentCategory;

  /**
   * If not defined, it takes all values for a given category by default.
   */
  public validFileTypes: LegalFileType[];

  public files: LegalFile[];

  public readonly apiPath: string;

  constructor(params: ILegalDocument) {
    super(params);
    this.apiPath = 'legal-documents';
    this.category = params.category;
    this.validFileTypes = params.validFileTypes;
    this.files = params.files;
  }
}
