import { Civility, MaritalStatus } from './Application.interface';

/**
 * Folder configuration
 */
export interface IFolder {
  id: string;
  createdAt: Date;
  expiredAt: Date;
  updatedAt: Date;
  lastFileUploadedAt?: Date;
  legalDocuments: ILegalDocument[];
  signatures: ISignature[];
  state: FolderState;
  supportingDocuments: ISupportingDocument[];
}

/**
 * Document properties
 */
export interface IDocument {
  callbackUrl?: string;
  createdAt: Date;
  holder: Holder;
  id: string;
  internalComments: InternalComment[];
  partnerId?: string;
  period?: DocumentPeriod;
  properties?: DocumentProperties;
  redirectUrl?: string;
  redirectUrlCreatedAt?: number;
  redirectUrlTTL: number;
  rejectionCode: RejectionCode;
  required: boolean;
  state: DocumentState;
  updatedAt: Date;
}

/**
 * Legal document
 *
 */
export interface ILegalDocument extends IDocument {
  category: LegalDocumentCategory;
  validFileTypes: LegalFileType[];
  files: LegalFile[];
}

/**
 * Supporting Document
 */
export interface ISupportingDocument extends IDocument {
  category: SupportingDocumentCategory;
  validFileTypes: SupportingFileType[];
  files: SupportingFile[];
  plugIn: SupportingDocumentPlugin;
}

/**
 * Category of supporting document
 */
export enum SupportingDocumentCategory {
  PROOF_OF_IDENTITY = 'PROOF_OF_IDENTITY',
  PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS',
  FACE_MATCHING = 'FACE_MATCHING',
  PROOF_OF_IDENTITY_FACE_MATCH = 'PROOF_OF_IDENTITY_FACE_MATCH',
  PROOF_OF_INCOME = 'PROOF_OF_INCOME',
  BANKING_INFORMATION = 'BANKING_INFORMATION',
  OTHERS = 'OTHERS',
}

/**
 * Plugin of supporting document
 */
export interface SupportingDocumentPlugin {
  ariadNext: { baseUrl: string };
  budgetInsightBill: { baseUrl: string; token: string };
}

/**
 * File types of supporting documents
 */
export enum SupportingFileType {
  ID_CARD = 'ID_CARD',
  ID_CARD_FRONT = 'ID_CARD_FRONT',
  ID_CARD_BACK = 'ID_CARD_BACK',
  PASSPORT = 'PASSPORT',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  DRIVING_LICENSE_FRONT = 'DRIVING_LICENSE_FRONT',
  DRIVING_LICENSE_BACK = 'DRIVING_LICENSE_BACK',
  RESIDENCE_PERMIT = 'RESIDENCE_PERMIT',
  RESIDENCE_PERMIT_BACK = 'RESIDENCE_PERMIT_BACK',
  RESIDENCE_PERMIT_FRONT = 'RESIDENCE_PERMIT_FRONT',
  SOCIAL_SECURITY_CARD = 'SOCIAL_SECURITY_CARD',
  SELFIE = 'SELFIE',
  FACE_MATCHING = 'FACE_MATCHING',
  ID_FACE_MATCHING = 'ID_FACE_MATCHING',
  ID_FACE_MATCHING_FRONT = 'ID_FACE_MATCHING_FRONT',
  ID_FACE_MATCHING_BACK = 'ID_FACE_MATCHING_BACK',
  UTILITY_BILL = 'UTILITY_BILL',
  TAX_ASSESSMENT = 'TAX_ASSESSMENT',
  TAX_NOTICE = 'TAX_NOTICE',
  MORTGAGE_STATEMENT = 'MORTGAGE_STATEMENT',
  RENT_RECEIPT = 'RENT_RECEIPT',
  HOUSE_INSURANCE = 'HOUSE_INSURANCE',
  PENSION_LETTER_NOTIFICATION = 'PENSION_LETTER_NOTIFICATION',
  HOST_ID = 'HOST_ID',
  HOST_ID_FRONT = 'HOST_ID_FRONT',
  HOST_ID_BACK = 'HOST_ID_BACK',
  HOST_PASSPORT = 'HOST_PASSPORT',
  HOST_DRIVING_LICENSE = 'HOST_DRIVING_LICENSE',
  HOST_DRIVING_LICENSE_FRONT = 'HOST_DRIVING_LICENSE_FRONT',
  HOST_DRIVING_LICENSE_BACK = 'HOST_DRIVING_LICENSE_BACK',
  PAY_STUB = 'PAY_STUB',
  ANNUITY_STATEMENT = 'ANNUITY_STATEMENT',
  PENSION_DISTRIBUTION_STATEMENT = 'PENSION_DISTRIBUTION_STATEMENT',
  UNEMPLOYED_BENEFITS = 'UNEMPLOYED_BENEFITS',
  WORKERS_COMPENSATION_LETTER = 'WORKERS_COMPENSATION_LETTER',
  BANK_STATEMENT = 'BANK_STATEMENT',
  BANK_ACCOUNT_DETAILS = 'BANK_ACCOUNT_DETAILS',
  PROOF_OF_PURCHASE = 'PROOF_OF_PURCHASE',
  CAR_REGISTRATION_DOCUMENT = 'CAR_REGISTRATION_DOCUMENT',
}

/**
 * State of folder
 */
export enum FolderState {
  CREATED,
  IN_PROGRESS,
  SUSPECTED,
  OK,
  ABANDONED,
  ACCEPTED,
  REFUSED,
}

/**
 * Internal comment
 */
export interface InternalComment {
  content: string;
  sentAt: Date;
}

/**
 * Holder
 */
export enum Holder {
  APPLICANT = 'APPLICANT',
  CO_APPLICANT = 'CO_APPLICANT',
}

/**
 * Document properties
 */
export interface DocumentProperties {
  accountCoOwner: string;
  accountOwner: string;
  address: Address;
  annualGrossIncomes: number;
  bankName: BankName;
  bic: string;
  birthCity: string;
  birthCountry: string;
  birthDate: string;
  birthDepartment: number;
  birthDistrict: number;
  birthName: string;
  civility: Civility;
  deliveredAt: string;
  documentNumber: string;
  expiredAt: Date;
  firstName: string;
  iban: string;
  lastName: string;
  maritalStatus: MaritalStatus;
  mrzLines: string[];
  nationality: string;
  netMonthlyIncomes: number;
  numberOfChildren: number;
  score: number;
}

/**
 * Address
 */
export interface Address {
  additionalInformation: string;
  city: string;
  street: string;
  zipCode: string;
}

/**
 * Enumeration of bank names
 */
export enum BankName {
  ALLIANZ = 'ALLIANZ',
  AXA = 'AXA',
  BANQUE_POPULAIRE = 'BANQUE_POPULAIRE',
  BARCLAYS = 'BARCLAYS',
  BNP = 'BNP',
  BOURSORAMA = 'BOURSORAMA',
  CAISSE_DEPOTS_CONSIGNATIONS = 'CAISSE_DEPOTS_CONSIGNATIONS',
  CAISSE_EPARGNE = 'CAISSE_EPARGNE',
  CAIXA_GERAL_DEPOSITOS = 'CAIXA_GERAL_DEPOSITOS',
  NICKEL = 'NICKEL',
  CNE = 'CNE',
  CREDIT_AGRICOLE = 'CREDIT_AGRICOLE',
  CREDIT_NORD = 'CREDIT_NORD',
  CREDIT_LYONNAIS = 'CREDIT_LYONNAIS',
  CREDIT_MUNICIPAL = 'CREDIT_MUNICIPAL',
  CREDIT_MUTUEL = 'CREDIT_MUTUEL',
  CZAM_CARREFOUR = 'CZAM_CARREFOUR',
  FORTUNEO = 'FORTUNEO',
  GROUPAMA = 'GROUPAMA',
  CIC = 'CIC',
  HSBC = 'HSBC',
  ING_DIRECT = 'ING_DIRECT',
  BANQUE_POSTALE = 'BANQUE_POSTALE',
  LCL = 'LCL',
  LB = 'LB',
  MONABANQ = 'MONABANQ',
  SOCIETE_GENERALE = 'SOCIETE_GENERALE',
  STE_MARSEILLAISE_CREDIT = 'STE_MARSEILLAISE_CREDIT',
  SYGMA_BANQUE = 'SYGMA_BANQUE',
  CETELEM = 'CETELEM',
  ONEY = 'ONEY',
  CREDIT_FONCIER_FRANCE = 'CREDIT_FONCIER_FRANCE',
  CREDIPAR = 'CREDIPAR',
  DIAC = 'DIAC',
  FACET = 'FACET',
  FIDEM = 'FIDEM',
  FINANCO = 'FINANCO',
  FRANFINANCE = 'FRANFINANCE',
  MY_MONEY_BANK = 'MY_MONEY_BANK',
  CARREFOUR_BANK = 'CARREFOUR_BANK',
  SOCRAM = 'SOCRAM',
  SOFINCO = 'SOFINCO',
  VIAXEL = 'VIAXEL',
  OTHER = 'OTHER',
}

/**
 * File
 */
export interface File {
  createdAt: Date;
  id: string;
  internalComments: InternalComment[];
  metadata: { extension: string; mimeType: string; name: string; size: number };
  properties: DocumentProperties;
  rejectionCode: number;
  signedUrl: string;
  signedUrlCreatedAt: Date;
  signedUrlTTL: number;
  state: FileState;
  updatedAt: Date;
}

/**
 * Legal file
 */
export interface LegalFile extends File {
  type: LegalFileType;
}

/**
 * Supporting file
 */
export interface SupportingFile extends File {
  type: SupportingFileType;
}

/**
 * State of the file
 */
export enum FileState {
  IN_PROGRESS = 1,
  REJECTED,
  SUSPECTED,
  OK,
}

/**
 * Type of the file
 */
export enum FileType {
  CONTRACT = 'CONTRACT',
  INFORMATION = 'INFORMATION',
  CONVENTION_OF_PROOF = 'CONVENTION_OF_PROOF',
  LOAN_AND_PAYMENT_AGREEMENT = 'LOAN_AND_PAYMENT_AGREEMENT',
  TERMS_OF_SALE = 'TERMS_OF_SALE',
  SEPA = 'SEPA',
  BANK_RECORDS = 'BANK_RECORDS',
  LEGAL_MENTIONS = 'LEGAL_MENTIONS',
  RECEIPT = 'RECEIPT',
  OTHERS = 'OTHERS',
}

/**
 * Document period
 */
export interface DocumentPeriod {
  count: number;
  unit: DocumentUnitPeriod;
}

/**
 * Unit period of document
 */
export enum DocumentUnitPeriod {
  YEAR = 'YEAR',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  DAY = 'DAY',
}

/**
 * Legal file type
 */
export enum LegalFileType {
  CONTRACT = 'CONTRACT',
  INFORMATION = 'INFORMATION',
  CONVENTION_OF_PROOF = 'CONVENTION_OF_PROOF',
  LOAN_AND_PAYMENT_AGREEMENT = 'LOAN_AND_PAYMENT_AGREEMENT',
  TERMS_OF_SALE = 'TERMS_OF_SALE',
  SEPA = 'SEPA',
  BANK_RECORDS = 'BANK_RECORDS',
  LEGAL_MENTIONS = 'LEGAL_MENTIONS',
  RECEIPT = 'RECEIPT',
  OTHERS = 'OTHERS',
}

/**
 * State of the document
 */
export enum DocumentState {
  CREATED,
  IN_PROGRESS,
  REJECTED,
  SUSPECTED,
  OK,
}

/**
 * Category of legal document
 */
export enum LegalDocumentCategory {
  INSURANCE_CONTRACT = 'INSURANCE_CONTRACT',
  PRODUCT_CONTRACT = 'PRODUCT_CONTRACT',
  DEBIT_MANDATE = 'DEBIT_MANDATE',
  RECORDS = 'RECORDS',
  LEGAL_MENTIONS = 'LEGAL_MENTIONS',
  INFORMATION = 'INFORMATION',
  RECEIPT = 'RECEIPT',
  OTHERS = 'OTHERS',
}

/**
 * Signature
 */
export interface ISignature {
  callbackUrl?: string;
  createdAt: number;
  holder: Holder;
  id: string;
  legalDocumentIds: string[];
  metadata?: unknown;
  partnerId: string;
  redirectUrl?: string;
  redirectUrlCreatedAt?: number;
  redirectUrlTTL?: number;
  state: SignatureState;
  plugIn?: ESPlugIn;
}

/**
 * Electronic signature available Plug-In
 */
export interface ESPlugIn {
  yousign: {
    baseUrl: string;
  };
}

/**
 * State of the signature
 */
export enum SignatureState {
  CREATED,
  IN_PROGRESS,
  REJECTED,
  // eslint-disable-next-line no-magic-numbers
  SIGNED = 4,
}

/**
 * Rejection code
 */
/* eslint-disable no-magic-numbers */
export enum RejectionCode {
  OUTSIDE_PERIMETER = 100,
  FORGED = 101,
  UNREADABLE = 102,
  NOT_COHERENT = 103,
  EXPIRED = 104,
  INCOMPLETE = 105,
}
/* eslint-disable no-magic-numbers */
