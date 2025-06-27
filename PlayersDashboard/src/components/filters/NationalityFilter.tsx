import React from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";
import NationalityWithFlag from "../NationalityWithFlag";

interface NationalityOption {
  label: string;
  code: string;
}

interface NationalityFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: NationalityOption[];
  disabled?: boolean;
}

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
    value={options.filter((c) => value.includes(c.label))}
    onChange={(_e, val) => onChange(val.map((v) => v.label))}
    disabled={disabled}
    renderOption={(props, option) => (
      <li {...props} key={option.code}>
        <NationalityWithFlag nationality={option.label} />
      </li>
    )}
    renderTags={(selected, getTagProps) =>
      selected.map((option, index) => {
        const { key, ...tagProps } = getTagProps({ index });
        return (
          <Chip
            key={key}
            label={<NationalityWithFlag nationality={option.label} />}
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
