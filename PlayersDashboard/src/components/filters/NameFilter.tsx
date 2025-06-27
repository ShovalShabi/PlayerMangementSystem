import React from "react";
import { TextField } from "@mui/material";

/**
 * Props for NameFilter component.
 * @property value The current name filter value.
 * @property onChange Callback when the name value changes.
 * @property disabled Optional. Disables the input if true.
 */
interface NameFilterProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Text input for filtering players by name.
 *
 * @param props NameFilterProps
 */
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
