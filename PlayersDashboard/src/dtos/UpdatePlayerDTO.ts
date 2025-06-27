// UpdatePlayerDTO.ts - Corresponds to backend UpdatePlayerDTO.java

/**
 * Data Transfer Object for updating player information.
 * Corresponds to backend UpdatePlayerDTO.java structure.
 * All fields are optional to allow partial updates.
 */
export default interface UpdatePlayerDTO {
  /** Player's first name (optional) */
  firstName?: string;

  /** Player's last name (optional) */
  lastName?: string;

  /** Set of nationalities (optional) */
  nationalities?: string[];

  /** Set of positions (optional) */
  positions?: string[];

  /** Player's date of birth (optional) - ISO date string (LocalDate) */
  dateOfBirth?: string;

  /** Player's height in meters (optional) */
  height?: number;
}
