/**
 * Represents an amount (or number of days) by month
 */
export interface Calendar {
  /**
   * Calendar month of the transaction
   */
  month: string;
  /**
   * Amount, negative if expense, positive if income.
   */
  amount?: number;
  /**
   * Number of days of the month covered in the banking history.
   */
  nbDays?: number;
}
