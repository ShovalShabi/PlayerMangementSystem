import React, { useRef } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from "@mui/icons-material/Download";

/**
 * Props for UploadCSVButton component.
 * @property onUpload Callback when a CSV file is selected.
 * @property loading Optional. Shows a loading spinner and disables the button if true.
 */
interface UploadCSVButtonProps {
  onUpload: (file: File) => void;
  loading?: boolean;
}

/**
 * Button for uploading a CSV file. Shows a loading spinner when uploading.
 *
 * @param props UploadCSVButtonProps
 */
const UploadCSVButton: React.FC<UploadCSVButtonProps> = ({
  onUpload,
  loading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <DownloadIcon />
        )
      }
      component="label"
      sx={{
        fontWeight: 500,
        fontSize: 15,
        borderRadius: 2,
        boxShadow: "none",
        height: 48,
        minWidth: 180,
        width: "100%",
      }}
      disabled={loading}
    >
      {loading ? "Uploading..." : "Upload CSV"}
      <input
        type="file"
        accept=".csv"
        hidden
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files[0]);
            e.target.value = "";
          }
        }}
      />
    </Button>
  );
};

export default UploadCSVButton;
