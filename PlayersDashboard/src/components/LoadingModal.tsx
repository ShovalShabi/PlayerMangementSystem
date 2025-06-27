import React, { useEffect, useState } from "react";
import { Modal, Box, CircularProgress, Typography } from "@mui/material";

/**
 * Props for LoadingModal component.
 * @property open Whether the modal is open.
 * @property message Optional loading message (defaults to "Loading...").
 */
interface LoadingModalProps {
  open: boolean;
  message?: string;
}

/**
 * Modal dialog that displays a loading spinner with optional timeout message.
 * Shows a warning message after 5 seconds if loading takes too long.
 *
 * @param props LoadingModalProps
 */
const LoadingModal: React.FC<LoadingModalProps> = ({
  open,
  message = "Loading...",
}) => {
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (open) {
      setTimeoutReached(false);
      timer = setTimeout(() => {
        setTimeoutReached(true);
      }, 5000);
    } else {
      setTimeoutReached(false);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
        setTimeoutReached(false);
      }
    };
  }, [open]);

  return (
    <Modal
      open={open}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(0, 0, 0, 0.5)",
          borderRadius: 2,
          p: 4,
          minWidth: 200,
          minHeight: 150,
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="white" sx={{ textAlign: "center" }}>
          {message}
        </Typography>
        {timeoutReached && (
          <Typography
            variant="body2"
            color="#ffb300"
            sx={{ mt: 2, textAlign: "center" }}
          >
            Request is taking longer than expected...
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default LoadingModal;
