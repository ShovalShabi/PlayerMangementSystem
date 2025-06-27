// Positions.ts - Enum for all possible player positions

/**
 * Enum defining all possible player positions in football.
 * Organized by defensive, midfield, and attacking positions.
 */
export enum Positions {
  // Defenders
  /** Centre-Back - Central defensive position */
  CB = "CB",
  /** Right-Back - Right defensive position */
  RB = "RB",
  /** Left-Back - Left defensive position */
  LB = "LB",
  /** Left Wing-Back - Left attacking defensive position */
  LWB = "LWB",
  /** Right Wing-Back - Right attacking defensive position */
  RWB = "RWB",
  // Midfielders
  /** Defensive Midfielder - Central defensive midfield position */
  CDM = "CDM",
  /** Centre Midfielder - Central midfield position */
  CM = "CM",
  /** Central Attacking Midfielder - Central attacking midfield position */
  CAM = "CAM",
  /** Right Midfielder - Right midfield position */
  RM = "RM",
  /** Left Midfielder - Left midfield position */
  LM = "LM",
  // Forwards
  /** Right Forward - Right attacking position */
  RF = "RF",
  /** Left Forward - Left attacking position */
  LF = "LF",
  /** Centre Forward - Central attacking position */
  CF = "CF",
  /** Striker - Primary attacking position */
  ST = "ST",
  /** Left Wing - Left wing attacking position */
  LW = "LW",
  /** Right Wing - Right wing attacking position */
  RW = "RW",
}
