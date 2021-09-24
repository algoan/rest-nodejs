/**
 * Aggregator name
 */
export enum AggregatorName {
  BUDGET_INSIGHT = 'BUDGET_INSIGHT',
  BRIDGE = 'BRIDGE',
  TINK = 'TINK',
  OTHER = 'OTHER',
}

/**
 * Mode used for the customer journey
 */
export enum BankConnectionMode {
  /**
   * The redirection mode. The UI is managed by the aggregator in a dedicated page.
   */
  REDIRECT = 'REDIRECT',
  /**
   * The aggregator's API. The UI is managed by Algoan.
   */
  API = 'API',
  /**
   * The iframe mode. The UI is managed by the aggregator in an iframe element.
   */
  IFRAME = 'IFRAME',
}

/**
 * Marital Status list
 */
export enum MaritalStatusV2 {
  COHABITING = 'COHABITING',
  DIVORCED = 'DIVORCED',
  MARRIED = 'MARRIED',
  SEPARATED = 'SEPARATED',
  SINGLE = 'SINGLE',
  WIDOWED = 'WIDOWED',
  CIVIL_PARTNERSHIP = 'CIVIL_PARTNERSHIP',
}

/**
 * Customer dashboard states
 */
export enum CustomerDashboardState {
  NEW = 'NEW',
  VIEWED = 'VIEWED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Storage type for expired customers
 */
export enum CustomerStorageType {
  DELETION = 'DELETION',
  PARTIAL_DELETION = 'PARTIAL_DELETION',
  DEMO = 'DEMO',
}
