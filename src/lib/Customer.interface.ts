import {
  AggregatorName,
  BankConnectionMode,
  CustomerDashboardState,
  CustomerStorageType,
  MaritalStatusV2,
} from './Customer.enum';

/**
 * Customer
 */
export interface Customer {
  /**
   * The organization's id
   */
  organizationId: string;
  /**
   * The project's id
   */
  projectId: string;
  /**
   * Id of the Keycloak user who created the customer
   * We fetch it from the sub of the JWT
   */
  userId?: string;
  /**
   * A custom identifier that will be attached to the customer.
   * This can be used to identify a customer based on the client's internal reference.
   */
  customIdentifier: string;
  /**
   * Information about the AIS provider used for the report
   */
  aggregationDetails: AggregationDetails;
  /**
   * Personal information about the customer
   */
  personalDetails?: PersonalDetails;
  /**
   * Status indicating if the customer is archived
   */
  isArchived?: boolean;
  /**
   * Dashboard Property of the customer for the new dashboard
   */
  dashboard?: CustomerDashboard;
  /**
   * The organization and project where the customer belongs to originally
   */
  owner?: Project;
  /**
   * The projects that the customer is shared with
   */
  shares?: SharedProject[];
  /**
   * Storage Properties of the customer
   */
  storage?: CustomerStorage;
}

/**
 * Interface representing the aggregation details
 */
export interface AggregationDetails {
  /**
   * Aggregator's customer identifier
   */
  userId?: string;
  /**
   * Name of the aggregator company
   */
  aggregatorName?: AggregatorName;
  /**
   * Callback URL set for a customer.
   * Used to redirect the customer back to your user journey if you are using the aggregation in REDIRECT mode.
   */
  callbackUrl?: string;
  /**
   * Temporary access token set for Algoan's UI to communicate with the aggregator's API
   */
  token?: string;
  /**
   * Mode used for the customer journey
   */
  mode?: BankConnectionMode;
  /**
   * Redirect URL used for the end-user. Specific to REDIRECT mode
   */
  redirectUrl?: string;
  /**
   * URL used to call API using API mode
   */
  apiUrl?: string;
  /**
   * Iframe URL used for the end-user. Specific to IFRAME mode
   */
  iframeUrl?: string;
  /**
   * Aggregator client ID used to authenticate a customer with the organization
   */
  clientId?: string;
}

/**
 * Interface representing the personal information about the customer
 */
export interface PersonalDetails {
  /**
   * Identity information about a customer
   */
  identity?: CustomerIdentity;
  /**
   * Contact information about a customer
   */
  contact?: CustomerContact;
  /**
   * Household information about a customer
   */
  household?: Household;
}

/**
 * Interface representing the identity information about a customer
 */
export interface CustomerIdentity {
  /**
   * Nationality
   */
  nationality?: string;
  /**
   * First name
   */
  firstName?: string;
  /**
   * Last name
   */
  lastName?: string;
  /**
   * Birth name
   */
  birthName?: string;
  /**
   * Birth date
   */
  birthDate?: string;
  /**
   * Birth city
   */
  birthCity?: string;
  /**
   * Birth Zip code
   */
  birthZipCode?: string;
  /**
   * Birth country
   */
  birthCountry?: string;
}

/**
 * Interface representing the contact information about a customer
 */
export interface CustomerContact {
  /**
   * Electronic mail adress
   */
  email?: string;
  /**
   * Phone number (E.164 format)
   */
  phoneNumber?: string;
  /**
   * Street
   */
  street?: string;
  /**
   * Additional information about the address
   */
  additionalInformation?: string;
  /**
   * City where the customer lives
   */
  city?: string;
  /**
   * Zip code of the customer's city
   */
  zipCode?: string;
  /**
   * Country of the customer
   */
  country?: string;
}

/**
 * Household information about a customer
 */
export interface Household {
  /**
   * State of this report
   */
  maritalStatus?: MaritalStatusV2;
  /**
   * The number of children the customer is in charge of
   */
  numberOfDependentChildren?: number;
  /**
   * The number of other people the customer is in charge of
   */
  numberOfOtherDependents?: number;
}

/**
 * Compute the newWithAnalysis field
 */
export interface CustomerDashboard {
  /**
   * Current state of the customer's report
   */
  currentState: CustomerDashboardState;
  /**
   * States history: represents an array containing the history of the customer's report
   */
  historyState: HistoryState[];
  /**
   * Number of times the report was viewed
   */
  numberOfViews: number;
  /**
   * Number of analyses linked to the customer
   */
  numberOfAnalyses: number;
  /**
   * New with analysis
   */
  newWithAnalysis?: boolean;
  /**
   * New with analysis
   */
  onboarding?: Record<string, unknown>;
  /**
   * Team corresponding to the customer's dashboard
   */
  team?: string;
  /**
   * Monthly amount set by customer
   */
  customizedMonthlyAmount?: number;
  /**
   * Analyses config of the customer
   * 1st string key of the map is an analysis Id
   * 2st string key of the map is a cash flow Id
   */
  analysesConfig?: Record<string, Record<string, CashFlowConfig>>;
  /**
   * Filled by mongoose
   */
  createdAt?: string;
}

/**
 * Class representing the different states of a customer's dashboard reports
 */
export interface HistoryState {
  /**
   * The date the state was created at
   */
  createdAt: string;
  /**
   * State of this report
   */
  state: CustomerDashboardState;
  /**
   * User that consulted the dashboard and changed the report state
   */
  userId: string;
}

/**
 * The cashflow config for the customer dashboard
 */
export interface CashFlowConfig {
  /**
   * Indicate if the cashflow is included in the calculation of remainder to live
   */
  isIncludedInRemainderToLive: boolean;
}

/**
 * Project
 */
export interface Project {
  /**
   * The organization's id
   */
  organizationId: string;
  /**
   * The project's id
   */
  projectId: string;
}

/**
 * Shared project
 */
export interface SharedProject {
  /**
   * The organization's id
   */
  organizationId: string;
  /**
   * The project's id
   */
  projectId: string;
  /**
   * The time of share
   */
  sharedAt: string;
}

/**
 * Interface representing customer data storage Properties
 */
export interface CustomerStorage {
  /**
   * Type of storage when customer data is expired
   */
  type?: CustomerStorageType;
  /**
   * Expiration date of customer data
   */
  expiresAt?: string;
}
