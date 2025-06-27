import React from "react";
import { Box, TextField } from "@mui/material";

/**
 * Props for HeightFilter component.
 * @property min Minimum height value.
 * @property max Maximum height value.
 * @property onMinChange Callback for minimum height change.
 * @property onMaxChange Callback for maximum height change.
 * @property unit Height unit ("m" for meters, "ft" for feet).
 * @property disabled Optional. Disables the input fields if true.
 */
interface HeightFilterProps {
  min: string;
  max: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  unit: "m" | "ft";
  disabled?: boolean;
}

/**
 * Renders two number input fields for filtering by minimum and maximum height, with unit label.
 *
 * @param props HeightFilterProps
 */
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
