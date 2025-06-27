import React, { ReactNode } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";

/**
 * Props for GenericModalComponent.
 * @property open Whether the modal is open.
 * @property title Optional title for the modal.
 * @property children Content to display in the modal.
 * @property handleClose Callback when the modal is closed.
 * @property handleSubmit Optional callback for the submit button.
 * @property submitLabel Optional label for the submit button (defaults to "Submit").
 */
interface GenericModalComponentProps {
  open: boolean;
  title?: string;
  children: ReactNode;
  handleClose: () => void;
  handleSubmit?: () => void;
  submitLabel?: string;
}

/**
 * Reusable modal dialog component with title, content, and optional submit button.
 * Provides a consistent modal layout across the application.
 *
 * @param props GenericModalComponentProps
 */
const GenericModalComponent: React.FC<GenericModalComponentProps> = ({
  open,
  title,
  children,
  handleClose,
  handleSubmit,
  submitLabel = "Submit",
}) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {title && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            p: 2,
          }}
        >
          <DialogTitle sx={{ flex: 1, textAlign: "center", p: 0 }}>
            {title}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      <DialogContent dividers>{children}</DialogContent>
      {handleSubmit && (
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {submitLabel}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default GenericModalComponent;
