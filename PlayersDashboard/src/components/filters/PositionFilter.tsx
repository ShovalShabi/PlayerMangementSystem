import React from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";

/**
 * Props for PositionFilter component.
 * @property value Array of selected position strings.
 * @property onChange Callback when the selected positions change.
 * @property options List of all possible position options.
 * @property disabled Optional. Disables the input if true.
 */
interface PositionFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  disabled?: boolean;
}

/**
 * Multi-select autocomplete for filtering by player positions.
 *
 * @param props PositionFilterProps
 */
const PositionFilter: React.FC<PositionFilterProps> = ({
  value,
  onChange,
  options,
  disabled,
}) => (
  <Autocomplete
    multiple
    options={options}
    getOptionLabel={(option) => option}
    value={value}
    onChange={(_e, val) => onChange(val)}
    disabled={disabled}
    renderTags={(selected, getTagProps) =>
      selected.map((option, index) => {
        const { key, ...tagProps } = getTagProps({ index });
        return <Chip key={key} label={option} {...tagProps} />;
      })
    }
    renderInput={(params) => (
      <TextField {...params} label="Positions" size="small" />
    )}
    sx={{ mb: 2 }}
  />
);

export default PositionFilter;
