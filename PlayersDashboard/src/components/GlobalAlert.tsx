import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import useAlert from "../hooks/useAlert";

/**
 * Global alert component that displays notifications using the alert context.
 * Shows a snackbar with the current alert message and severity.
 */
const GlobalAlert: React.FC = () => {
  const { alert, setAlert } = useAlert();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(!!alert);
  }, [alert]);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
    setAlert(null);
  };

  if (!alert) return <></>;
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={alert.severity}
      >
        {alert.message}
      </MuiAlert>
    </Snackbar>
  );
};

export default GlobalAlert;
