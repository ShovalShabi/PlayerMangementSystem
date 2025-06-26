import React, { useEffect, useState } from "react";
import { Modal, Box, CircularProgress, Typography } from "@mui/material";

interface LoadingModalProps {
  open: boolean;
  message?: string;
}

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
