import React from "react";
import GenericModalComponent from "./GenericModalComponent";
import { Typography } from "@mui/material";

/**
 * Props for the ConfirmationModal component.
 * @property open Whether the modal is open.
 * @property title Optional title for the modal dialog.
 * @property message The confirmation message to display.
 * @property onClose Callback when the modal is closed/cancelled.
 * @property onConfirm Callback when the user confirms the action.
 * @property confirmLabel Optional label for the confirm button (defaults to "Confirm").
 */
interface ConfirmationModalProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}

/**
 * A reusable modal dialog for confirming user actions.
 *
 * Renders a message and confirm/cancel buttons. Uses GenericModalComponent for layout.
 *
 * @param props ConfirmationModalProps
 */
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
