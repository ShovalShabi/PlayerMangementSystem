// PlayerDTO.ts - Corresponds to backend PlayerDTO.java

export default interface PlayerDTO {
  /** Player ID (optional on POST request) */
  id?: number;

  /** Player's first name */
  firstName: string;

  /** Player's last name */
  lastName: string;

  /** Set of nationalities (must not be null or empty) */
  nationalities: string[];

  /** Player's date of birth (must be in the past) */
  dateOfBirth: string; // ISO date string (LocalDate)

  /** Set of positions (must not be null or empty) */
  positions: string[];

  /** Player's height in meters (must be between 1.5 and 2.2) */
  height: number;

  /** Creation date (optional on POST request) */
  creationDate?: string; // ISO date string (Date)

  /** Last modified date (optional on POST request) */
  lastModifiedDate?: string; // ISO date string (Date)
}
