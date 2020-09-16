import { ISignature, Holder, SignatureState } from '../lib';

/**
 * Signature instance
 * Cf: https://developers.algoan.com/api/#operation/getSignatureDocument
 */
export class Signature implements ISignature {
  /**
   * Define when Algoan needs a redirectUrl. It is used to redirect the user after an external process.
   */
  public callbackUrl: string;

  /**
   * The date of creation of the signature
   */
  public createdAt: Date;

  /**
   * Signatory
   */
  public holder: Holder;

  /**
   * Unique signature document identifier
   */
  public id: string;

  /**
   * An array of legal documents id (signed or not)
   */
  public legalDocumentIds: string[];

  /**
   * metadata about the document to sign (e.g., position of the signature, or information
   * about the signature success)
   */
  public metadata: unknown;

  /**
   * Signature id from the Signature Partner
   */
  public partnerId: string;

  /**
   * In case of an electronic signature, redirection link to the provider
   */
  public redirectUrl: string;

  /**
   * The date of creation of the redirectUrl
   */
  public redirectUrlCreatedAt: Date;

  /**
   * The max time of validity of the redirectUrl (in second)
   */
  public redirectUrlTTL: number;

  /**
   * Status of the signature document
   */
  public state: SignatureState;

  constructor(params: ISignature) {
    this.callbackUrl = params.callbackUrl;
    this.createdAt = params.createdAt;
    this.holder = params.holder;
    this.id = params.id;
    this.legalDocumentIds = params.legalDocumentIds;
    this.metadata = params.metadata;
    this.partnerId = params.partnerId;
    this.redirectUrl = params.redirectUrl;
    this.redirectUrlCreatedAt = params.redirectUrlCreatedAt;
    this.redirectUrlTTL = params.redirectUrlTTL;
    this.state = params.state;
  }
}
