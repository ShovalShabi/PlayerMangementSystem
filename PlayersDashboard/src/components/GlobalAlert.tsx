import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import useAlert from "../hooks/useAlert";

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

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      message={
        alert ? (
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleClose}
            severity={alert.severity}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </MuiAlert>
        ) : undefined
      }
    />
  );
};

export default GlobalAlert;
