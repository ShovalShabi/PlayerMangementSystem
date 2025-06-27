import React from "react";
import MainPage from "./pages/MainPage";

/**
 * Main App component that serves as the root component of the application.
 *
 * This component is intentionally minimal and acts as a wrapper that renders
 * the MainPage component. It provides a clean separation between the app
 * initialization logic (handled in main.tsx) and the main application content.
 *
 * The actual application logic, state management, and UI components are
 * contained within the MainPage component and its child components.
 *
 * @returns {JSX.Element} The rendered MainPage component
 */
const App: React.FC = () => {
  return <MainPage />;
};

export default App;
