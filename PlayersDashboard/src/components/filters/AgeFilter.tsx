import React from "react";
import { Box, TextField } from "@mui/material";

/**
 * Props for AgeFilter component.
 * @property min Minimum age value.
 * @property max Maximum age value.
 * @property onMinChange Callback for minimum age change.
 * @property onMaxChange Callback for maximum age change.
 * @property disabled Optional. Disables the input fields if true.
 */
interface AgeFilterProps {
  min: string;
  max: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Renders two number input fields for filtering by minimum and maximum age.
 *
 * @param props AgeFilterProps
 */
const AgeFilter: React.FC<AgeFilterProps> = ({
  min,
  max,
  onMinChange,
  onMaxChange,
  disabled,
}) => (
  <Box display="flex" gap={1} mb={2}>
    <TextField
      label="Min Age"
      type="number"
      value={min}
      onChange={(e) => onMinChange(e.target.value)}
      size="small"
      disabled={disabled}
      fullWidth
    />
    <TextField
      label="Max Age"
      type="number"
      value={max}
      onChange={(e) => onMaxChange(e.target.value)}
      size="small"
      disabled={disabled}
      fullWidth
    />
  </Box>
);

export default AgeFilter;
