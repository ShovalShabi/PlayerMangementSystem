import React from "react";
import GenericModalComponent from "./GenericModalComponent";
import { Typography } from "@mui/material";

interface ConfirmationModalProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel = "Confirm",
}) => {
  return (
    <GenericModalComponent
      open={open}
      title={title}
      handleClose={onClose}
      handleSubmit={onConfirm}
      submitLabel={confirmLabel}
    >
      <Typography variant="body1" align="center">
        {message}
      </Typography>
    </GenericModalComponent>
  );
};

export default ConfirmationModal;
