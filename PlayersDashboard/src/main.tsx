import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { themeSettings } from "./theme";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "./store";
import { AlertProvider } from "./components/AlertProvider";

const ThemedApp = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const theme = React.useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertProvider>
        <App />
      </AlertProvider>
    </ThemeProvider>
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
