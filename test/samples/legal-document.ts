import {
  BankName,
  Civility,
  DocumentUnitPeriod,
  FileState,
  Holder,
  ILegalDocument,
  LegalDocument,
  LegalDocumentCategory,
  LegalFile,
  LegalFileType,
  MaritalStatus,
  MultiResourceCreationResponse,
  PostLegalDocumentDTO,
  PostLegalFileDTO,
  RejectionCode,
  RequestBuilder,
} from '../../src';
import { createReadStream } from 'fs';

export const legalFileSample: LegalFile = {
  id: '5d1930e00000000000000000',
  type: LegalFileType.CONTRACT,
  state: 2,
  internalComments: [
    {
      content: 'string',
      sentAt: new Date('2019-08-24T14:15:22Z'),
    },
  ],
  rejectionCode: 0,
  createdAt: new Date('2019-06-30T22:00:00.000Z'),
  updatedAt: new Date('2019-06-30T22:00:00.000Z'),
  metadata: {
    size: 1234890,
    name: 'identity',
    extension: 'png',
    mimeType: 'image/png',
  },
  signedUrl:
    'https://storage.googleapis.com/example-bucket/cat.jpeg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=example%40example-project.iam.gserviceaccount.com%2F20181026%2Fus-central-1%2Fstorage%2Fgoog4_request&X-Goog-Date=20181026T181309Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=247a2aa45f169edf4d187d54e7cc46e4731b1e6273242c4f4c39a1d2507a0e58706e25e3a85a7dbb891d62afa8496def8e260c1db863d9ace85ff0a184b894b117fe46d1225c82f2aa19efd52cf21d3e2022b3b868dcc1aca2741951ed5bf3bb25a34f5e9316a2841e8ff4c530b22ceaa1c5ce09c7cbb5732631510c20580e61723f5594de3aea497f195456a2ff2bdd0d13bad47289d8611b6f9cfeef0c46c91a455b94e90a66924f722292d21e24d31dcfb38ce0c0f353ffa5a9756fc2a9f2b40bc2113206a81e324fc4fd6823a29163fa845c8ae7eca1fcf6e5bb48b3200983c56c5ca81fffb151cca7402beddfc4a76b133447032ea7abedc098d2eb14a7',
  signedUrlTTL: 3600,
  signedUrlCreatedAt: new Date(1565111781),
  properties: {
    firstName: 'John',
    lastName: 'Smith',
    birthName: 'string',
    birthDate: '2019-08-24',
    birthDepartment: 75,
    birthDistrict: 12,
    birthCity: 'Paris',
    birthCountry: 'FR',
    address: {
      street: '5, rue test',
      additionalInformation: 'Appartement 48',
      zipCode: '75001',
      city: 'Paris',
    },
    expiredAt: new Date('2019-08-24'),
    nationality: 'FR',
    civility: Civility.MISTER,
    mrzLines: ['string'],
    iban: 'FR7614410000011234567890163',
    bankName: BankName.CARREFOUR_BANK,
    bic: 'DEFOFRP1XXX',
    accountOwner: 'John Doe',
    accountCoOwner: 'Jane Doe',
    score: 0.5,
    netMonthlyIncomes: 1000,
    annualGrossIncomes: 20000,
    deliveredAt: '2008-03',
    maritalStatus: MaritalStatus.SINGLE,
    numberOfChildren: 1,
    documentNumber: '1224A1432141',
  },
};

export const legalDocumentSample: ILegalDocument = {
  id: '5d1930e00000000000000000',
  partnerId: 'a1a2a3a',
  category: LegalDocumentCategory.INSURANCE_CONTRACT,
  state: 2,
  rejectionCode: 103,
  createdAt: new Date('2019-06-30T22:00:00.000Z'),
  updatedAt: new Date('2019-06-30T22:00:00.000Z'),
  files: [legalFileSample],
  holder: Holder.CO_APPLICANT,
  required: true,
  validFileTypes: [LegalFileType.CONTRACT],
  period: {
    count: 3,
    unit: DocumentUnitPeriod.MONTH,
  },
  properties: {
    firstName: 'John',
    lastName: 'Smith',
    birthName: 'string',
    birthDate: '2019-08-24',
    birthDepartment: 75,
    birthDistrict: 12,
    birthCity: 'Paris',
    birthCountry: 'FR',
    address: {
      street: '5, rue test',
      additionalInformation: 'Appartement 48',
      zipCode: '75001',
      city: 'Paris',
    },
    expiredAt: new Date('2019-08-24'),
    nationality: 'FR',
    civility: Civility.MISTER,
    mrzLines: ['string'],
    iban: 'FR7614410000011234567890163',
    bankName: BankName.CARREFOUR_BANK,
    bic: 'DEFOFRP1XXX',
    accountOwner: 'John Doe',
    accountCoOwner: 'Jane Doe',
    score: 0.5,
    netMonthlyIncomes: 1000,
    annualGrossIncomes: 20000,
    deliveredAt: '2008-03',
    maritalStatus: MaritalStatus.SINGLE,
    numberOfChildren: 1,
    documentNumber: '1224A1432141',
  },
  internalComments: [
    {
      content: 'string',
      sentAt: new Date('2019-08-24T14:15:22Z'),
    },
  ],
  redirectUrl: 'https://link/to/face-matching',
  redirectUrlTTL: 259200,
  redirectUrlCreatedAt: undefined,
  callbackUrl: 'https://www.algoanapp.com/conversations/token/id',
};

export const postLegalDocumentsResponse = (
  requestBuilder: RequestBuilder,
): MultiResourceCreationResponse<LegalDocument> => {
  return {
    elements: [
      {
        resource: new LegalDocument(legalDocumentSample, 'folderId', requestBuilder),
        status: 200,
      },
    ],
    metadata: { failure: 0, success: 1, total: 1 },
  };
};

export const fileToUploadWithoutMedia: PostLegalFileDTO = {
  rejectionCode: 23,
  state: FileState.IN_PROGRESS,
  type: LegalFileType.BANK_RECORDS,
};

export const fileToUploadWithMedia: PostLegalFileDTO = {
  file: createReadStream(__filename),
  rejectionCode: 23,
  state: FileState.IN_PROGRESS,
  type: LegalFileType.BANK_RECORDS,
};

export const newLegalDocuments: PostLegalDocumentDTO[] = [
  {
    category: LegalDocumentCategory.DEBIT_MANDATE,
    holder: Holder.APPLICANT,
    required: true,
    partnerId: 'partnerId',
    period: {
      count: 34,
      unit: DocumentUnitPeriod.MONTH,
    },
    redirectUrl: 'url',
    redirectUrlTTL: 12,
    rejectionCode: RejectionCode.FORGED,
    validFileTypes: [LegalFileType.BANK_RECORDS],
  },
];
