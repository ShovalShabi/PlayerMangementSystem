import React from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";

interface PositionFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  disabled?: boolean;
}

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
