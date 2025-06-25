import React, { useRef, useState } from "react";
import GenericModalComponent from "./GenericModalComponent";
import { Box, Button, Typography, Input } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface UploadCSVModalProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (file: File | null) => void;
}

const UploadCSVModal: React.FC<UploadCSVModalProps> = ({
  open,
  handleClose,
  handleSubmit,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmit = () => {
    handleSubmit(selectedFile);
  };

  return (
    <GenericModalComponent
      open={open}
      handleClose={handleClose}
      handleSubmit={onSubmit}
      title="Upload CSV File"
      submitLabel="Upload"
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Button
          variant="outlined"
          startIcon={<UploadFileIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          Choose CSV File
        </Button>
        <Input
          inputRef={fileInputRef}
          type="file"
          inputProps={{ accept: ".csv" }}
          sx={{ display: "none" }}
          onChange={onFileChange}
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
