/**
 * Information provided by the aggregator
 */
export interface Aggregator {
  /**
   * Id of the transaction/account on the aggregator
   */
  id: string;
  type?: string;
  category?: string;
}
