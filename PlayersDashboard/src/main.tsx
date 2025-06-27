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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  </React.StrictMode>
);

export default ThemedApp;
