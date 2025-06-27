/**
 * Response interface for CSV bulk upload operations.
 * Contains arrays of successful and failed player creation attempts.
 */
export default interface CsvUploadResponse {
  /** Array of row numbers that were successfully created. */
  successfully_created: Array<number>;
  /** Array of row numbers that failed to create. */
  failed_to_create: Array<number>;
}
