import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { themeSettings } from "./theme";
import { Provider, useSelector } from "react-redux";
import store, { persistor } from "./store";
import { AlertProvider } from "./components/AlertProvider";
import { PersistGate } from "redux-persist/integration/react";
import { State } from "./utils/interfaces/state";

/**
 * ThemedApp component that provides theme context and state management.
 *
 * This component is responsible for:
 * - Connecting to the Redux store to access theme state
 * - Creating and providing the Material-UI theme based on the current theme mode
 * - Wrapping the application with Redux persistence
 * - Providing global alert functionality
 *
 * The component uses React.useMemo to optimize theme creation and prevent
 * unnecessary re-renders when the theme mode changes.
 *
 * @returns {JSX.Element} The themed application wrapped with all necessary providers
 */
const ThemedApp = () => {
  const mode = useSelector((state: State) => state.theme);
  const theme = React.useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AlertProvider>
          <App />
        </AlertProvider>
      </ThemeProvider>
    </PersistGate>
  );
};

/**
 * Application entry point that initializes the React application.
 *
 * This function:
 * - Creates the root React element using ReactDOM.createRoot
 * - Wraps the application with React.StrictMode for development debugging
 * - Provides the Redux store to the entire application
 * - Renders the ThemedApp component which handles theme and state management
 *
 * The component hierarchy from top to bottom:
 * 1. React.StrictMode - Development mode debugging
 * 2. Redux Provider - Global state management
 * 3. ThemedApp - Theme and persistence setup
 * 4. PersistGate - Redux state persistence
 * 5. ThemeProvider - Material-UI theming
 * 6. CssBaseline - CSS reset and baseline styles
 * 7. AlertProvider - Global alert notifications
 * 8. App - Main application component
 * 9. MainPage - Primary application content
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  </React.StrictMode>
);

export default ThemedApp;
