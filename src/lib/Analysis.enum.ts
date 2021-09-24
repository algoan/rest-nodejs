/**
 * Source of rhe analysis
 */
export enum AnalysisSource {
  INTERNAL = 'INTERNAL',
  CLIENT = 'CLIENT',
  CASH_FLOW_UPDATE = 'CASH_FLOW_UPDATE',
  MANUAL_REFRESH = 'MANUAL_REFRESH',
}

/**
 * Origin of the banking data
 */
export enum DataOrigin {
  OPEN_BANKING = 'OPEN_BANKING',
  PDF = 'PDF',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Status of the analysis
 */
export enum AnalysisStatus {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}
