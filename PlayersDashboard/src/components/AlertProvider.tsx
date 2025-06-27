import { createContext, useState, ReactNode } from "react";
import GlobalAlert from "./GlobalAlert";

/**
 * Context value type for alert state management.
 * @property alert The current alert object, or null if no alert is active.
 * @property setAlert Function to update or clear the alert.
 */
export interface AlertContextType {
  alert: {
    /**
     * The alert message to display. Can be a string or a React node.
     */
    message: string | ReactNode;
    /**
     * The severity level of the alert.
     */
    severity: "error" | "warning" | "info" | "success";
  } | null;
  setAlert: (
    alert: {
      message: string | ReactNode;
      severity: "error" | "warning" | "info" | "success";
    } | null
  ) => void;
}

/**
 * React context for global alert state. Use with `useContext(AlertContext)`.
 */
const AlertContext = createContext<AlertContextType | undefined>(undefined);

/**
 * Provides global alert state to all children. Wrap your app with this provider to enable alerts.
 *
 * @param children React children that will have access to the alert context.
 */
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertContextType["alert"]>(null);
  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
      <GlobalAlert />
    </AlertContext.Provider>
  );
};

export { AlertContext };
