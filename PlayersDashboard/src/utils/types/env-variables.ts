/**
 * Type definition for environment variables returned by getEnvVariables.
 * Contains application configuration for ports, environment, and service URLs.
 */
export type EnvVariables = {
  /** The port number for the application server. */
  port: number;
  /** The current environment (dev, prod, testing). */
  env: string;
  /** The complete URL for the Player Service API. */
  playerServiceURL: string;
};
