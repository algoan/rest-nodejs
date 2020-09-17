import {
  ILegalDocument,
  LegalDocumentCategory,
  LegalFile,
  LegalFileType,
  MultiResourceCreationResponse,
  PostLegalDocumentDTO,
  PostLegalFileDTO,
} from '../lib';
import { RequestBuilder } from '../RequestBuilder';
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

  constructor(params: ILegalDocument, folderId: string, private readonly requestBuilder: RequestBuilder) {
    super(params, folderId);
    this.category = params.category;
    this.validFileTypes = params.validFileTypes;
    this.files = params.files;
  }

  /**
   * Push a new legal document in the folder's list of documents.
   *
   * @param requestBuilder Service account request builder
   * @param folderId the id of the folder in which documents are created
   * @param body the legal documents to add
   */
  public static async create(
    requestBuilder: RequestBuilder,
    folderId: string,
    body: PostLegalDocumentDTO[],
  ): Promise<MultiResourceCreationResponse<LegalDocument>> {
    const res = await requestBuilder.request<MultiResourceCreationResponse<ILegalDocument>>({
      url: `/v1/folders/${folderId}/legal-documents`,
      method: 'POST',
      data: body,
    });

    return {
      ...res,
      elements: res.elements.map((element) => ({
        ...element,
        resource: new LegalDocument(element.resource, folderId, requestBuilder),
      })),
    };
  }

  /**
   * Get one file in a specific document section, in a chosen folder.
   *
   * @param requestBuilder Service account request builder
   * @param params the path parameters of the request
   */
  public static async getFileById(
    requestBuilder: RequestBuilder,
    params: { folderId: string; legalDocumentId: string; fileId: string },
  ): Promise<LegalFile> {
    return requestBuilder.request<LegalFile>({
      url: `/v1/folders/${params.folderId}/legal-documents/${params.legalDocumentId}/files/${params.fileId}`,
      method: 'GET',
    });
  }

  /**
   * Upload a file in the current legal document.
   *
   * @param requestBuilder Service account request builder
   * @param body the content of the file to upload
   */
  public async uploadFile(body: PostLegalFileDTO): Promise<LegalFile> {
    const getFilePayload = async (): Promise<FormData | undefined> => {
      const readStream = body.file;
      if (readStream === undefined) {
        return undefined;
      }

      return new Promise((resolve) => {
        readStream.on('end', async () => {
          const formData = new FormData();
          formData.append(this.id, (readStream as unknown) as Blob);
          resolve(formData);
        });
      });
    };

    const filePayload = await getFilePayload();
    const file = await this.requestBuilder.request<LegalFile>({
      url: `/v1/folders/${this.folderId}/legal-documents/${this.id}/files`,
      method: 'POST',
      data: { ...body, file: filePayload },
    });

    this.files.push(file);

    return file;
  }
}
