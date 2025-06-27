// PlayerDTO.ts - Corresponds to backend PlayerDTO.java

/**
 * Data Transfer Object for player information.
 * Corresponds to backend PlayerDTO.java structure.
 */
export default interface PlayerDTO {
  /** Player ID (optional on POST request) */
  id?: number;

  /** Player's first name */
  firstName: string;

  /** Player's last name */
  lastName: string;

  /** Set of nationalities (must not be null or empty) */
  nationalities: string[];

  /** Player's date of birth (must be in the past) - ISO date string (LocalDate) */
  dateOfBirth: string;

  /** Set of positions (must not be null or empty) */
  positions: string[];

  /** Player's height in meters (must be between 1.5 and 2.2) */
  height: number;

  /** Creation date (optional on POST request) - ISO date string (Date) */
  creationDate?: string;

  /** Last modified date (optional on POST request) - ISO date string (Date) */
  lastModifiedDate?: string;
}
