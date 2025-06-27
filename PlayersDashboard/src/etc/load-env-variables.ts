import type { EnvVariables } from "../utils/types/env-variables";

/**
 * Cached environment variables to avoid repeated processing.
 * Set to null initially and populated on first call to getEnvVariables.
 */
let cachedEnv: EnvVariables | null = null;

/**
 * Retrieves and caches environment variables with appropriate defaults for different environments.
 *
 * This function reads environment variables injected through Vite, constructs service URLs,
 * and determines port configurations based on the current environment. It provides a unified
 * object with all necessary environment configurations and implements caching for performance.
 *
 * @returns {EnvVariables} An object containing:
 *  - port: The port number for the server (0 for testing, 3001 for dev, 3000 for prod)
 *  - env: The current environment ('dev', 'prod', or 'testing')
 *  - playerServiceURL: The complete URL for the Player Service API
 */
const getEnvVariables = (): EnvVariables => {
  if (cachedEnv) return cachedEnv;

  // Destructure the necessary environment variables from process.env
  const {
    VITE_PORT, // The port to be used in the application
    VITE_ENV, // The current environment (e.g., dev, prod)
    VITE_BACKEND_HOST, // Backend server host
    VITE_BACKEND_PORT, // Backend server port
  } = process.env;

  // Determine the current environment (defaults to 'dev' if undefined)
  const env = VITE_ENV || "dev";

  let port = 0;

  // Configure port based on environment
  if (env === "dev") {
    // Development environment: use development port, defaulting to 3001
    port = parseInt(VITE_PORT || "3001", 10);
  } else if (env === "prod") {
    // Production environment: use production port, defaulting to 3000
    port = parseInt(VITE_PORT || "3000", 10);
  } else {
    // Default to port 0 for other cases (e.g., testing)
    port = 0;
  }

  // Validation for backend host and port environment variables
  const backendHost = VITE_BACKEND_HOST || "localhost";
  const backendPort = VITE_BACKEND_PORT || "8081";

  // Construct URLs for services based on environment variables
  const playerServiceURL = `http://${backendHost}:${backendPort}/api/players`;

  console.log(playerServiceURL);

  // Cache and return the gathered and constructed environment variables
  cachedEnv = {
    port,
    env,
    playerServiceURL,
  };

  return cachedEnv;
};

// Export the function for use in other parts of the application
export default getEnvVariables;
