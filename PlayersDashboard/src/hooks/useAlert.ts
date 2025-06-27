import { useContext } from "react";
import { AlertContext } from "../components/AlertProvider";

/**
 * Custom hook to access the alert context for managing global alerts.
 *
 * Provides access to the alert state and setAlert function for triggering
 * notifications throughout the application. Alerts include messages and
 * severity levels: "error", "warning", "info", and "success".
 *
 * @throws {Error} When used outside of AlertProvider context.
 * @returns The alert context containing current alert state and setAlert function.
 */
const useAlert = () => {
  // Retrieve the alert context using the useContext hook
  const context = useContext(AlertContext);

  // Throw an error if the hook is used outside of the AlertProvider component
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }

  // Return the context if valid
  return context;
};

export default useAlert;
