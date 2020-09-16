import {
  ISupportingDocument,
  SupportingDocumentCategory,
  SupportingDocumentPlugin,
  SupportingFile,
  SupportingFileType,
} from '../lib';
import { Document } from './Document';

/**
 * Supporting document instance
 * Cf: https://developers.algoan.com/api/#operation/getSupportingDocuments
 */
export class SupportingDocument extends Document implements ISupportingDocument {
  /**
   * Category of the supporting document
   */
  public category: SupportingDocumentCategory;

  /**
   * If not defined, it takes all values for a given category by default.
   */
  public validFileTypes: SupportingFileType[];

  public files: SupportingFile[];

  /**
   * List of plug-ins linked to the supporting-document process
   */
  public plugIn: SupportingDocumentPlugin;

  public readonly apiPath: string;

  constructor(params: ISupportingDocument, folderId: string) {
    super(params, folderId);
    this.apiPath = 'supporting-documents';
    this.category = params.category;
    this.validFileTypes = params.validFileTypes;
    this.files = params.files;
    this.plugIn = params.plugIn;
  }
}
