import React from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";
import NationalityWithFlag from "../NationalityWithFlag";

/**
 * Represents a nationality option with label and country code.
 * @property label The country name.
 * @property code The country code.
 */
interface NationalityOption {
  label: string;
  code: string;
}

/**
 * Props for NationalityFilter component.
 * @property value Array of selected nationality codes (ISO codes).
 * @property onChange Callback when the selected nationalities change.
 * @property options List of all possible nationality options.
 * @property disabled Optional. Disables the input if true.
 */
interface NationalityFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: NationalityOption[];
  disabled?: boolean;
}

/**
 * Multi-select autocomplete for filtering by player nationalities, with flag display.
 *
 * @param props NationalityFilterProps
 */
const NationalityFilter: React.FC<NationalityFilterProps> = ({
  value,
  onChange,
  options,
  disabled,
}) => (
  <Autocomplete
    multiple
    options={options}
    getOptionLabel={(option) => option.label}
    value={options.filter((c) => value.includes(c.code))}
    onChange={(_e, val) => onChange(val.map((v) => v.code))}
    disabled={disabled}
    renderOption={(props, option) => (
      <li {...props} key={option.code}>
        <NationalityWithFlag nationality={option.code} />
      </li>
    )}
    renderTags={(selected, getTagProps) =>
      selected.map((option, index) => {
        const { key, ...tagProps } = getTagProps({ index });
        return (
          <Chip
            key={key}
            label={<NationalityWithFlag nationality={option.code} />}
            {...tagProps}
          />
        );
      })
    }
    renderInput={(params) => (
      <TextField {...params} label="Nationalities" size="small" />
    )}
    sx={{ mb: 2 }}
  />
);

export default NationalityFilter;
