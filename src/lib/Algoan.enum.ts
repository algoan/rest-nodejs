/**
 * Enum for eventName
 */
export enum EventName {
  RECOVERY_REQUIRED = 'recovery_required',
  SERVICE_ACCOUNT_CREATED = 'service_account_created',
  SERVICE_ACCOUNT_UPDATED = 'service_account_updated',
  SERVICE_ACCOUNT_DELETED = 'service_account_deleted',
  PRODUCTS_REQUIRED = 'products_required',
  PRICINGS_REQUIRED = 'pricings_required',
  INSURANCES_REQUIRED = 'insurances_required',
  DECISION_REQUIRED = 'decision_required',
  BANKREADER_LINK_REQUIRED = 'bankreader_link_required',
  BANKREADER_CONFIGURATION_REQUIRED = 'bankreader_configuration_required',
  BANKREADER_REQUIRED = 'bankreader_required',
  BANKREADER_COMPLETED = 'bankreader_completed',
  EXPERT_INDICATORS_COMPLETED = 'expert_indicators_completed',
  FINANCIAL_CHECK_COMPLETED = 'financial_check_completed',
  CREDIT_SCORE_REQUIRED = 'credit_score_required',
  CREDIT_SCORE_COMPLETED = 'credit_score_completed',
  ELECTRONIC_SIGNATURE_LINK_REQUIRED = 'electronic_signature_link_required',
  ELECTRONIC_SIGNATURE_CONFIGURATION_REQUIRED = 'electronic_signature_configuration_required',
  ELECTRONIC_SIGNATURE_COMPLETED = 'electronic_signature_completed',
  CONVERSATION_LINK_CREATED = 'conversation_link_created',
  APPLICATION_UPDATED = 'application_updated',

  LEGAL_DOCUMENTS_REQUIRED = 'legal_documents_required',
  KYC_DOCUMENTS_LIST_REQUIRED = 'kyc_documents_list_required',
  KYC_FOLDER_VALIDATION_REQUIRED = 'kyc_folder_validation_required',
  KYC_FILE_UPLOADED = 'kyc_file_uploaded',

  // kyc event for supporting documents cf. https://developers.algoan.com/public/docs/algoan_documentation/exposed_resources/folder.html#supporting-document
  KYC_BANKING_INFORMATION_COMPLETED = 'kyc_banking_information_completed',
  KYC_BANKING_INFORMATION_LINK_REQUIRED = 'kyc_banking_information_link_required',
  KYC_FACE_MATCHING_COMPLETED = 'kyc_face_matching_completed',
  KYC_FACE_MATCHING_LINK_REQUIRED = 'kyc_face_matching_link_required',
  KYC_PROOF_OF_ADDRESS_COMPLETED = 'kyc_proof_of_address_completed',
  KYC_PROOF_OF_ADDRESS_LINK_REQUIRED = 'kyc_proof_of_address_link_required',
  KYC_PROOF_OF_IDENTITY_COMPLETED = 'kyc_proof_of_identity_completed',
  KYC_PROOF_OF_IDENTITY_LINK_REQUIRED = 'kyc_proof_of_identity_link_required',
  KYC_PROOF_OF_INCOME_COMPLETED = 'kyc_proof_of_income_completed',
  KYC_PROOF_OF_INCOME_LINK_REQUIRED = 'kyc_proof_of_income_link_required',
  KYC_PROOF_OF_IDENTITY_FACE_MATCH_COMPLETED = 'kyc_proof_of_identity_face_match_completed',
  KYC_PROOF_OF_IDENTITY_FACE_MATCH_LINK_REQUIRED = 'kyc_proof_of_identity_face_match_link_required',
  KYC_BANKING_INFORMATION_CONFIGURATION_REQUIRED = 'kyc_banking_information_configuration_required',
  KYC_FACE_MATCHING_CONFIGURATION_REQUIRED = 'kyc_face_matching_configuration_required',
  KYC_PROOF_OF_ADDRESS_CONFIGURATION_REQUIRED = 'kyc_proof_of_address_configuration_required',
  KYC_PROOF_OF_IDENTITY_CONFIGURATION_REQUIRED = 'kyc_proof_of_identity_configuration_required',
  KYC_PROOF_OF_INCOME_CONFIGURATION_REQUIRED = 'kyc_proof_of_income_configuration_required',
  KYC_PROOF_OF_IDENTITY_FACE_MATCH_CONFIGURATION_REQUIRED = 'kyc_proof_of_identity_face_match_configuration_required',
  // kyc events for legal documents files cf. https://developers.algoan.com/public/docs/algoan_documentation/exposed_resources/folder.html#legal-document
  KYC_INSURANCE_CONTRACT_LINK_REQUIRED = 'kyc_insurance_contract_link_required',
  KYC_INSURANCE_CONTRACT_COMPLETED = 'kyc_insurance_contract_completed',
  KYC_PRODUCT_CONTRACT_LINK_REQUIRED = 'kyc_product_contract_link_required',
  KYC_PRODUCT_CONTRACT_COMPLETED = 'kyc_product_contract_completed',
  KYC_INFORMATION_LINK_REQUIRED = 'kyc_information_link_required',
  KYC_INFORMATION_COMPLETED = 'kyc_information_completed',
  KYC_DEBIT_MANDATE_LINK_REQUIRED = 'kyc_debit_mandate_link_required',
  KYC_DEBIT_MANDATE_COMPLETED = 'kyc_debit_mandate_completed',
  KYC_RECORDS_LINK_REQUIRED = 'kyc_records_link_required',
  KYC_RECORDS_COMPLETED = 'kyc_records_completed',
  KYC_LEGAL_MENTIONS_LINK_REQUIRED = 'kyc_legal_mentions_link_required',
  KYC_LEGAL_MENTIONS_COMPLETED = 'kyc_legal_mentions_completed',
  KYC_RECEIPT_LINK_REQUIRED = 'kyc_receipt_link_required',
  KYC_RECEIPT_COMPLETED = 'kyc_receipt_completed',

  // for both supporting and legals documents
  KYC_OTHERS_LINK_REQUIRED = 'kyc_others_link_required',
  KYC_OTHERS_COMPLETED = 'kyc_others_completed',
  KYC_OTHERS_CONFIGURATION_REQUIRED = 'kyc_others_configuration_required',

  // V2 events
  AGGREGATOR_LINK_REQUIRED = 'aggregator_link_required',
  BANK_DETAILS_REQUIRED = 'bank_details_required',
}

/**
 * Enum for EventStatus
 */
export enum EventStatus {
  /** IN_PROGRESS: Algoan has just created the event and is about to call the resthook */
  IN_PROGRESS = 'IN_PROGRESS',
  /** ACK: The connector has acknowledged the request */
  ACK = 'ACK',
  /** PROCESSED: Warns Algoan that the process has been fully completed */
  PROCESSED = 'PROCESSED',
  /** FAILED: Warns Algoan that an error occurred during the process */
  FAILED = 'FAILED',
  /** ERROR: The API did not acknowledge the request */
  ERROR = 'ERROR',
  /** WARNING: A warning email has been sent to the organization's contact */
  WARNING = 'WARNING',
  /** CRITICAL: A critical email has been sent to the organization's contact */
  CRITICAL = 'CRITICAL',
}

export type AnalysisAlerts =
  | 'LOW_ACCOUNTS_READABILITY'
  | 'ADEN_USER_DIVERGENCE'
  | 'UNDECLARED_EXPENSE'
  | 'UNDETECTED_INCOME_NET_MONTHLY_INCOMES'
  | 'UNDETECTED_INCOME_OTHER_MONTHLY_INCOMES'
  | 'UNDETECTED_INCOME_RENT_ASSISTANCE'
  | 'UNDETECTED_INCOME_FAMILY_ALLOWANCE'
  | 'UNDETECTED_INCOME_PENSION_INCOMES'
  | 'UNDETECTED_INCOME_RENT_AMOUNT'
  | 'UNDETECTED_INCOME_PENSION_CHARGES'
  | 'UNDETECTED_INCOME_CARE_CHARGES'
  | 'UNDETECTED_INCOME_OTHER_CHARGES'
  | 'UNDETECTED_INCOME_CURRENT_LOANS'
  | 'NET_MONTHLY_INCOMES_MISSING_MONTH'
  | 'OTHER_MONTHLY_INCOMES_MISSING_MONTH'
  | 'RENT_ASSISTANCE_MISSING_MONTH'
  | 'FAMILY_ALLOWANCE_MISSING_MONTH'
  | 'PENSION_INCOMES_MISSING_MONTH'
  | 'RENT_AMOUNT_MISSING_MONTH'
  | 'PENSION_CHARGES_MISSING_MONTH'
  | 'CARE_CHARGES_MISSING_MONTH'
  | 'OTHER_CHARGES_MISSING_MONTH'
  | 'CURRENT_LOANS_MISSING_MONTH'
  | 'NET_MONTHLY_INCOMES_LOW_RELIABILITY'
  | 'OTHER_MONTHLY_INCOMES_LOW_RELIABILITY'
  | 'RENT_ASSISTANCE_LOW_RELIABILITY'
  | 'FAMILY_ALLOWANCE_LOW_RELIABILITY'
  | 'PENSION_INCOMES_LOW_RELIABILITY'
  | 'RENT_AMOUNT_LOW_RELIABILITY'
  | 'PENSION_CHARGES_LOW_RELIABILITY'
  | 'CARE_CHARGES_LOW_RELIABILITY'
  | 'OTHER_CHARGES_LOW_RELIABILITY'
  | 'CURRENT_LOANS_LOW_RELIABILITY'
  | 'COAPPLICANT_UNDECLARED_EXPENSE'
  | 'UNDETECTED_INCOME_COAPPLICANT_NET_MONTHLY_INCOMES'
  | 'UNDETECTED_INCOME_COAPPLICANT_OTHER_MONTHLY_INCOMES'
  | 'UNDETECTED_INCOME_COAPPLICANT_RENT_ASSISTANCE'
  | 'UNDETECTED_INCOME_COAPPLICANT_FAMILY_ALLOWANCE'
  | 'UNDETECTED_INCOME_COAPPLICANT_PENSION_INCOMES'
  | 'UNDETECTED_INCOME_COAPPLICANT_RENT_AMOUNT'
  | 'UNDETECTED_INCOME_COAPPLICANT_PENSION_CHARGES'
  | 'UNDETECTED_INCOME_COAPPLICANT_CARE_CHARGES'
  | 'UNDETECTED_INCOME_COAPPLICANT_OTHER_CHARGES'
  | 'UNDETECTED_INCOME_COAPPLICANT_CURRENT_LOANS'
  | 'COAPPLICANT_NET_MONTHLY_INCOMES_MISSING_MONTH'
  | 'COAPPLICANT_OTHER_MONTHLY_INCOMES_MISSING_MONTH'
  | 'COAPPLICANT_RENT_ASSISTANCE_MISSING_MONTH'
  | 'COAPPLICANT_FAMILY_ALLOWANCE_MISSING_MONTH'
  | 'COAPPLICANT_PENSION_INCOMES_MISSING_MONTH'
  | 'COAPPLICANT_RENT_AMOUNT_MISSING_MONTH'
  | 'COAPPLICANT_PENSION_CHARGES_MISSING_MONTH'
  | 'COAPPLICANT_CARE_CHARGES_MISSING_MONTH'
  | 'COAPPLICANT_OTHER_CHARGES_MISSING_MONTH'
  | 'COAPPLICANT_CURRENT_LOANS_MISSING_MONTH'
  | 'COAPPLICANT_NET_MONTHLY_INCOMES_LOW_RELIABILITY'
  | 'COAPPLICANT_OTHER_MONTHLY_INCOMES_LOW_RELIABILITY'
  | 'COAPPLICANT_RENT_ASSISTANCE_LOW_RELIABILITY'
  | 'COAPPLICANT_FAMILY_ALLOWANCE_LOW_RELIABILITY'
  | 'COAPPLICANT_PENSION_INCOMES_LOW_RELIABILITY'
  | 'COAPPLICANT_RENT_AMOUNT_LOW_RELIABILITY'
  | 'COAPPLICANT_PENSION_CHARGES_LOW_RELIABILITY'
  | 'COAPPLICANT_CARE_CHARGES_LOW_RELIABILITY'
  | 'COAPPLICANT_OTHER_CHARGES_LOW_RELIABILITY'
  | 'COAPPLICANT_CURRENT_LOANS_LOW_RELIABILITY';

/**
 * Enum for banksUser Account usage
 */
export enum UsageType {
  PROFESSIONAL = 'PROFESSIONAL',
  PERSONAL = 'PERSONAL',
}

/**
 * BanksUser AccountType
 */
export enum AccountType {
  CHECKINGS = 'CHECKINGS',
  SAVINGS = 'SAVINGS',
  LOAN = 'LOAN',
  CREDIT_CARD = 'CREDIT_CARD',
}

/**
 * BanksUserTransactionType
 */
export enum BanksUserTransactionType {
  ATM = 'ATM',
  BANK_FEE = 'BANK_FEE',
  CASH = 'CASH',
  CHECK = 'CHECK',
  CREDIT = 'CREDIT',
  CREDIT_CARD_PAYMENT = 'CREDIT_CARD_PAYMENT',
  DEBIT = 'DEBIT',
  DEPOSIT = 'DEPOSIT',
  DIRECT_DEBIT = 'DIRECT_DEBIT',
  DIRECT_DEPOSIT = 'DIRECT_DEPOSIT',
  DIVIDEND = 'DIVIDEND',
  ELECTRONIC_PAYMENT = 'ELECTRONIC_PAYMENT',
  INTEREST = 'INTEREST',
  INTERNAL_TRANSFERT = 'INTERNAL_TRANSFERT',
  POINT_OF_SALE = 'POINT_OF_SALE',
  POTENTIAL_TRANSFER = 'POTENTIAL_TRANSFER',
  REPEATING_PAYMENT = 'REPEATING_PAYMENT',
  OTHER = 'OTHER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * BanksUser statuses
 */
export enum BanksUserStatus {
  NEW = 'NEW',
  SYNCHRONIZING = 'SYNCHRONIZING',
  FINISHED = 'FINISHED',
  ACCOUNTS_SYNCHRONIZED = 'ACCOUNTS_SYNCHRONIZED',
  CONNECTION_COMPLETED = 'CONNECTION_COMPLETED',
}

/**
 * Loan details account type
 */
export type LoanAccountType =
  | 'AUTO'
  | 'CONSUMER'
  | 'CONSTRUCTION'
  | 'MORTGAGE'
  | 'OTHER'
  | 'HOMEEQUITY'
  | 'COMMERCIAL'
  | 'STUDENT'
  | 'MILITARY'
  | 'SMB';

/**
 * ScoresTypes only value
 */
export type ScoresType = 'CREDIT';

/**
 * AnalysisReliability enum
 */
export enum AnalysisReliability {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

/**
 * RegularCashFlow configurations
 */
export type RegularCashFlowConfiguration = 'A' | 'B' | 'C' | 'D';
