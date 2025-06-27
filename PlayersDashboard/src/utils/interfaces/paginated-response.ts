/**
 * Generic interface for paginated API responses.
 * Used for player list and other paginated data.
 *
 * @template T The type of items in the content array.
 */
export default interface PaginatedResponse<T> {
  /** Array of items for the current page. */
  content: T[];
  /** Total number of items across all pages. */
  totalElements: number;
  /** Total number of pages available. */
  totalPages: number;
  /** Current page number (0-indexed). */
  number: number;
}
