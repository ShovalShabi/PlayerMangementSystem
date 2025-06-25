// UpdatePlayerDTO.ts - Corresponds to backend UpdatePlayerDTO.java

export default interface UpdatePlayerDTO {
  /** Player's first name (optional) */
  firstName?: string;

  /** Player's last name (optional) */
  lastName?: string;

  /** Set of nationalities (optional) */
  nationalities?: string[];

  /** Set of positions (optional) */
  positions?: string[];

  /** Player's date of birth (optional) */
  dateOfBirth?: string; // ISO date string (LocalDate)

  /** Player's height in meters (optional) */
  height?: number;
}
