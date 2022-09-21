/**
 * Application
 */
export interface IApplication {
  /**
   * Unique identifier
   */
  id: string;
  /**
   * load Term
   */
  loanTerm?: number;
  /**
   * Requested loan amount
   */
  loanAmount?: number;
  /**
   * Amount to repay every period
   */
  paymentAmount?: number;

  paymentFrequency?: PaymentFrequency;
  /**
   * Nature of the user\'s project
   */
  projectType?: ProjectType;
  /**
   * marital status of the applicant
   */
  maritalStatus?: MaritalStatus;
  /**
   * Number of children of the applicant
   */
  numberOfChildren?: number;

  /**
   * Number of other dependent of the applicant
   */
  otherDependentNumber?: number;
  /**
   * Residential status of the applicant
   */
  residentialStatus?: ResidentialStatus;
  /**
   * Housing type of the applicant
   */
  housingType?: HousingType;
  /**
   * Residential seniority
   */
  residentialSeniorityDate?: string;

  optIn?: OptIn;
  /**
   * Specify if the applicant owns a secondary residence
   */
  hasSecondaryResidence?: boolean;
  /**
   * Skip the aggregation process
   */
  skipAggregation?: boolean;
  /**
   * Skip the GDPF connection process
   */
  skipGDPF?: boolean;
  /**
   * The identifier of the application on the bank partner side
   */
  partnerId?: string;
  /**
   * Link the loyalty account to the application
   */
  loyaltyAccountLinked?: boolean;
  /**
   * The identifier of the product related to the application
   */
  productId?: string;
  applicant?: Applicant;
  coApplicant?: Applicant;
  userSelection?: {
    productId?: string;
    productPartnerId: string;
    pricingId?: string;
    pricingPartnerId?: string;
    debitType?: string;
  };
  /**
   * Application status
   */
  status?: ApplicationStatus;
  /**
   * External errors
   */
  externalErrors?: ExternalError[];
  /**
   * Data from partner system
   */
  partnerData?: PartnerData;
  /**
   * Timestamps
   */
  createdAt: Date;
  updatedAt: Date;
}
/**
 * ProjectType
 */
export enum ProjectType {
  NEW_VEHICLE = 'NEW_VEHICLE',
  USED_VEHICLE = 'USED_VEHICLE',
  WORK = 'WORK',
  PERSONAL = 'PERSONAL',
}
/**
 * ApplicationStatus
 */
export enum ApplicationStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED',
  PENDING = 'PENDING',
  ERROR = 'ERROR',
}
/**
 * MaritalStatus
 */
export enum MaritalStatus {
  COHABITING = 'COHABITING',
  DIVORCED = 'DIVORCED',
  MARRIED = 'MARRIED',
  SEPARATED = 'SEPARATED',
  SINGLE = 'SINGLE',
  WIDOWED = 'WIDOWED',
  CIVIL_PARTNERSHIP = 'CIVIL_PARTNERSHIP',
}
/**
 * ResidentialStatus
 */
export enum ResidentialStatus {
  TENANT = 'TENANT',
  OWNER = 'OWNER',
  OWNER_WITH_MORTGAGE = 'OWNER_WITH_MORTGAGE',
  HOUSED_BY_EMPLOYER = 'HOUSED_BY_EMPLOYER',
  HOUSED_BY_FAMILY = 'HOUSED_BY_FAMILY',
  HOUSED_BY_FRIEND = 'HOUSED_BY_FRIEND',
  OTHER = 'OTHER',
}
/**
 * HousingType
 */
export enum HousingType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  OTHER = 'OTHER',
}
/**
 * OptIn
 */
export interface OptIn {
  /**
   * applicant\'s consent to receive commercial offers
   */
  salesOffersOptIn?: boolean;
  /**
   * applicant\'s consent to receive commercial offers from partners
   */
  partnerOptIn?: boolean;
}
/**
 * extraProperties
 */
export interface ExtraProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
/**
 * Applicant
 */
export interface Applicant {
  professionalSituation?: ProfessionalSituation;
  identity?: Identity;
  incomes?: Incomes;
  contact?: Contact;
  charges?: Charges;
  bank?: Bank;
  /**
   * Identifier of the chosen insurance
   */
  insuranceIds?: InsuranceId[];
  /**
   * Additional properties for an applicant
   */
  extraProperties?: ExtraProperties;
}
/**
 * InsurtanceId object
 */
export interface InsuranceId {
  insuranceId?: string;
  insurancePartnerId?: string;
}
/**
 * Bank
 */
export interface Bank {
  /**
   * name of the applicant\'s bank
   */
  name?: string;
  /**
   * bank seniority date
   */
  seniorityDate?: string;
  /**
   * name of the account\'s owner
   */
  accountOwner?: string;
  /**
   * Type of the account
   */
  accountType?: BankAccountType;
  /**
   * IBAN of the user
   */
  iban?: string;
  /**
   * BIC of the user
   */
  bic?: string;
}
/**
 * AccountType
 */
export enum BankAccountType {
  PERSONAL = 'PERSONAL',
  JOINT = 'JOINT',
  OTHER = 'OTHER',
}
/**
 * ProfessionalSituation
 */
export interface ProfessionalSituation {
  /**
   * business sector
   */
  businessSector?: BusinessSector;

  /**
   * professional code
   */
  spcCode?: string;
  /**
   * Contract type
   */
  contractType?: ContractType;
  /**
   * Professional seniority date
   */
  seniorityDate?: string;
  /**
   * label of the profession
   */
  label?: string;

  /**
   * employerCity
   */
  employerCity?: string;

  /**
   * employerName
   */
  employerName?: string;

  /**
   * endDate for ending contract types
   */
  endDate?: string;

  /**
   * employer Department
   */
  employerDepartment?: string;

  /**
   * employer Department
   */
  employerCountryCode?: string;
}
/**
 * business sector
 */
export enum BusinessSector {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  AGRICULTURE = 'AGRICULTURE',
  ARTISANTRADER = 'ARTISAN_TRADER',
  INDEPENDENT = 'INDEPENDENT',
  RETIRED = 'RETIRED',
  OTHERS = 'OTHERS',
}
/**
 * Contract type
 */
export enum ContractType {
  PERMANENT = 'PERMANENT',
  FIXEDTERM = 'FIXED_TERM',
  TEMPORARY = 'TEMPORARY',
  OTHER = 'OTHER',
}
/**
 * Identity
 */
export interface Identity {
  /**
   * applicant\'s gender
   */
  civility?: Civility;
  /**
   * first name
   */
  firstName?: string;
  /**
   * last name
   */
  lastName?: string;
  /**
   * birth name
   */
  birthName?: string;
  /**
   * birth date
   */
  birthDate?: string;
  /**
   * birth department
   */
  birthDepartment?: string;
  /**
   * birth district
   */
  birthDistrict?: string;
  /**
   * birth city
   */
  birthCity?: string;
  /**
   * nationality (iso code)
   */
  nationality?: string;
  /**
   * birth country (iso code)
   */
  birthCountry?: string;
}
/**
 * Civility
 */
export enum Civility {
  MISTER = 'MISTER',
  MISS = 'MISS',
}
/**
 * Incomes
 */
export interface Incomes {
  netMonthlyIncomes?: number;
  nbOfMonthsNetIncomes?: number;
  otherMonthlyIncomes?: number;
  rentAssistance?: number;
  familyAllowance?: number;
  pensionIncomes?: number;
}
/**
 * Contact
 */
export interface Contact {
  email?: string;
  street?: string;
  /**
   * additional information about the address
   */
  additionalInformation?: string;
  postalCode?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  mobilePhoneNumber?: string;
  fixedLinePhoneNumber?: string;
}
/**
 * Charges
 */
export interface Charges {
  /**
   * Renting amount of the applicant housing
   */
  rentAmount?: number;
  /**
   * Charges the applicant pays for child support or alimony
   */
  pensionCharges?: number;
  /**
   * Charges the applicant pays for childcare
   */
  careCharges?: number;
  /**
   * Other charges the applicant pays
   */
  otherCharges?: number;
  /**
   * Loans that the applicant is currently repaying
   */
  currentLoans?: ChargeCurrentLoan[];
}
/**
 * ChargesCurrentLoans
 */
export interface ChargeCurrentLoan {
  /**
   * Type of loan
   */
  type?: LoanType;
  /**
   * The amount the applicant repays each month
   */
  monthlyPayments?: number;
  /**
   * The loan is granted by the partner
   */
  inHouse?: boolean;

  /**
   * Start date of the loan
   */
  startDate?: string;

  /**
   * End date of the loan
   */
  endDate?: string;

  /**
   * Bank name
   */
  bankName?: string;
}
/**
 * How often a user will pay paymentAmount
 */
export enum PaymentFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}
/**
 * LoanType
 */
export enum LoanType {
  REVOLVING = 'REVOLVING',
  VEHICLE = 'VEHICLE',
  WORKS = 'WORKS',
  PERSONAL = 'PERSONAL',
  MORTGAGE = 'MORTGAGE',
  OTHER = 'OTHER',
}
/**
 * External error
 */
export interface ExternalError {
  message: string;
  code?: string;
  tags?: string[];
}
/**
 * Partner Data
 */
export interface PartnerData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
