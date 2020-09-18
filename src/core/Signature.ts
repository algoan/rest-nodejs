import { RequestBuilder } from '..';
import { ISignature, Holder, SignatureState, PostSignatureDTO, PatchSignatureDTO } from '../lib';

/**
 * Signature instance
 * Cf: https://developers.algoan.com/api/#operation/getSignatureDocument
 */
export class Signature implements ISignature {
  /**
   * Define when Algoan needs a redirectUrl. It is used to redirect the user after an external process.
   */
  public callbackUrl?: string;

  /**
   * The date of creation of the signature
   */
  public createdAt: number;

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
  public metadata?: unknown;

  /**
   * Signature id from the Signature Partner
   */
  public partnerId: string;

  /**
   * In case of an electronic signature, redirection link to the provider
   */
  public redirectUrl?: string;

  /**
   * The date of creation of the redirectUrl
   */
  public redirectUrlCreatedAt?: number;

  /**
   * The max time of validity of the redirectUrl (in second)
   */
  public redirectUrlTTL?: number;

  /**
   * Status of the signature document
   */
  public state: SignatureState;

  /**
   * Folder ID attached to the signature
   */
  protected folderId: string;

  constructor(folderId: string, params: ISignature, private readonly requestBuilder: RequestBuilder) {
    this.folderId = folderId;
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

  /**
   * Create a new signature instance
   * @param requestBuilder Service account request builder
   * @param body POST signature request body
   * See more info here: https://developers.algoan.com/api/#operation/createSignatureDocument
   */
  public static async create(
    requestBuilder: RequestBuilder,
    folderId: string,
    body: PostSignatureDTO,
  ): Promise<Signature> {
    const signature: ISignature = await requestBuilder.request({
      url: `/v1/folders/${folderId}/signatures`,
      method: 'POST',
      data: body,
    });

    return new Signature(folderId, signature, requestBuilder);
  }

  /**
   * Get a signature instance from a folder by id
   * @param folderId Unique folder identifier
   * @param signatureId Unique signature identifier
   */
  public static async getById(
    requestBuilder: RequestBuilder,
    params: { folderId: string; signatureId: string },
  ): Promise<Signature> {
    const signature: ISignature = await requestBuilder.request({
      url: `/v1/folders/${params.folderId}/signatures/${params.signatureId}`,
      method: 'GET',
    });

    return new Signature(params.folderId, signature, requestBuilder);
  }

  /**
   * Update a signature instance
   * @param body Request body
   * See more info here: https://developers.algoan.com/api/#operation/updateSignatureDocument
   */
  public async update(body: PatchSignatureDTO): Promise<void> {
    const updatedSignature: ISignature = await this.requestBuilder.request({
      method: 'PATCH',
      data: body,
      url: `/v1/folders/${this.folderId}/signatures/${this.id}`,
    });

    this.callbackUrl = updatedSignature.callbackUrl;
    this.createdAt = updatedSignature.createdAt;
    this.holder = updatedSignature.holder;
    this.id = updatedSignature.id;
    this.legalDocumentIds = updatedSignature.legalDocumentIds;
    this.metadata = updatedSignature.metadata;
    this.partnerId = updatedSignature.partnerId;
    this.redirectUrl = updatedSignature.redirectUrl;
    this.redirectUrlCreatedAt = updatedSignature.redirectUrlCreatedAt;
    this.redirectUrlTTL = updatedSignature.redirectUrlTTL;
    this.state = updatedSignature.state;
  }
}
