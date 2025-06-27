import React from "react";
import { TextField } from "@mui/material";

interface NameFilterProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const NameFilter: React.FC<NameFilterProps> = ({
  value,
  onChange,
  disabled,
}) => (
  <TextField
    label="Player Name"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
    disabled={disabled}
    size="small"
    sx={{ mb: 2 }}
  />
);

export default NameFilter;
