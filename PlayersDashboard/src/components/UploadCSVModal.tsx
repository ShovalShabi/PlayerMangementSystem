import React, { useRef, useState } from "react";
import GenericModalComponent from "./GenericModalComponent";
import { Box, Button, Typography, Input } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { handleUploadCsv } from "../utils/handlers/uploadCsvHandler";

/**
 * Props for UploadCSVModal component.
 * @property open Whether the modal is open.
 * @property handleClose Callback when the modal is closed.
 * @property setAlert Function to display alert messages.
 * @property onSuccess Optional callback when upload is successful.
 */
interface UploadCSVModalProps {
  open: boolean;
  handleClose: () => void;
  setAlert: (
    alert: {
      message: React.ReactNode;
      severity: "error" | "warning" | "info" | "success";
    } | null
  ) => void;
  onSuccess?: () => void;
}

/**
 * Modal for uploading CSV files with drag-and-drop functionality.
 * Handles file selection and upload process with loading states.
 *
 * @param props UploadCSVModalProps
 */
const UploadCSVModal: React.FC<UploadCSVModalProps> = ({
  open,
  handleClose,
  setAlert,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    await handleUploadCsv(selectedFile, setAlert, onSuccess);
    setLoading(false);
    handleClose();
    setSelectedFile(null);
  };

  return (
    <GenericModalComponent
      open={open}
      handleClose={handleClose}
      handleSubmit={onSubmit}
      title="Upload CSV File"
      submitLabel={loading ? "Uploading..." : "Upload"}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Button
          variant="outlined"
          startIcon={<UploadFileIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          Choose CSV File
        </Button>
        <Input
          inputRef={fileInputRef}
          type="file"
          inputProps={{ accept: ".csv" }}
          sx={{ display: "none" }}
          onChange={onFileChange}
          disabled={loading}
        />
        {selectedFile && (
          <Typography variant="body2" color="text.secondary">
            Selected: {selectedFile.name}
          </Typography>
        )}
      </Box>
    </GenericModalComponent>
  );
};

export default UploadCSVModal;
