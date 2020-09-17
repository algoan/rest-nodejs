import { ReadStream } from 'fs';
import {
  IDocument,
  Holder,
  InternalComment,
  DocumentPeriod,
  DocumentProperties,
  DocumentState,
  RejectionCode,
} from '../lib';

/**
 * Base Document class used for any kind of document
 */
export abstract class Document implements IDocument {
  /**
   * Define when Algoan needs a redirectUrl. It is used to redirect the user after an external process.
   */
  public callbackUrl?: string;

  /**
   * Document date of creation
   */
  public createdAt: Date;

  /**
   * Document's holder
   */
  public holder: Holder;

  /**
   * Unique document identifier
   */
  public id: string;

  public internalComments: InternalComment[];

  /**
   * Partner identifier related to the document
   */
  public partnerId?: string;

  /**
   * Set the number of months required. For example, if the supporting document type
   * is a proof of income and months === 3, it means that the last 3 months are required.
   */
  public period?: DocumentPeriod;

  /**
   * Extracted data from a document
   */
  public properties?: DocumentProperties;

  /**
   * redirection Link to the provider
   */
  public redirectUrl?: string;

  /**
   * The date of creation of the redirectUrl
   */
  public redirectUrlCreatedAt?: number;

  /**
   * The max time of validity of the redirectUrl (in second)
   */
  public redirectUrlTTL: number;

  /**
   * Explains why the file has been REJECTED
   */
  public rejectionCode: RejectionCode;

  /**
   * Set to true if the document is required
   */
  public required: boolean;

  /**
   * Define the global document status
   */
  public state: DocumentState;

  /**
   * Document last update date
   */
  public updatedAt: Date;

  constructor(params: IDocument, readonly folderId: string) {
    this.callbackUrl = params.callbackUrl;
    this.createdAt = new Date(params.createdAt);
    this.holder = params.holder;
    this.id = params.id;
    this.internalComments = params.internalComments;
    this.partnerId = params.partnerId;
    this.period = params.period;
    this.properties = params.properties;
    this.redirectUrl = params.redirectUrl;
    this.redirectUrlCreatedAt = params.redirectUrlCreatedAt;
    this.redirectUrlTTL = params.redirectUrlTTL;
    this.rejectionCode = params.rejectionCode;
    this.required = params.required;
    this.state = params.state;
    this.updatedAt = new Date(params.updatedAt);
  }

  /**
   * Returns a promise containing the form data corresponding to the specified
   * readstream.
   *
   * @param readStream the readstream to transform
   */
  protected async getFilePayload(readStream: ReadStream): Promise<FormData> {
    return new Promise((resolve) => {
      readStream.on('end', async () => {
        const formData = new FormData();
        formData.append(this.id, (readStream as unknown) as Blob);
        resolve(formData);
      });

      readStream.read();
    });
  }
}
