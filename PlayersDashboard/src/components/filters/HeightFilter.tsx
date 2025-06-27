import React from "react";
import { Box, TextField } from "@mui/material";

interface HeightFilterProps {
  min: string;
  max: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  unit: "m" | "ft";
  disabled?: boolean;
}

const HeightFilter: React.FC<HeightFilterProps> = ({
  min,
  max,
  onMinChange,
  onMaxChange,
  unit,
  disabled,
}) => (
  <Box display="flex" gap={1} mb={2}>
    <TextField
      label={`Min Height (${unit})`}
      type="number"
      value={min}
      onChange={(e) => onMinChange(e.target.value)}
      size="small"
      disabled={disabled}
      fullWidth
    />
    <TextField
      label={`Max Height (${unit})`}
      type="number"
      value={max}
      onChange={(e) => onMaxChange(e.target.value)}
      size="small"
      disabled={disabled}
      fullWidth
    />
  </Box>
);

export default HeightFilter;
