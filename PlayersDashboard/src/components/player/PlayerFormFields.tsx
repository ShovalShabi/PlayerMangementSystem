import React from "react";
import { Box, TextField, Chip, FormControl } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Positions } from "../../utils/enums/Positions";
import listOfCountries from "../../utils/objects/countries-object";
import NationalityWithFlag from "../NationalityWithFlag";
import PlayerDTO from "../../dtos/PlayerDTO";

/**
 * Props for PlayerFormFields component.
 * @property form The player form data object.
 * @property editMode Whether the form is editable.
 * @property handleChange Callback to update a field value.
 */
interface PlayerFormFieldsProps {
  form: PlayerDTO;
  editMode: boolean;
  handleChange: (field: keyof PlayerDTO, value: unknown) => void;
}

/**
 * Renders form fields for player data entry/editing, including name, nationalities, date of birth, positions, and height.
 *
 * @param props PlayerFormFieldsProps
 */
const PlayerFormFields: React.FC<PlayerFormFieldsProps> = ({
  form,
  editMode,
  handleChange,
}) => (
  <Box
    component="form"
    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
  >
    <TextField
      label="First Name"
      value={form.firstName}
      onChange={(e) => handleChange("firstName", e.target.value)}
      fullWidth
      disabled={!editMode}
    />
    <TextField
      label="Last Name"
      value={form.lastName}
      onChange={(e) => handleChange("lastName", e.target.value)}
      fullWidth
      disabled={!editMode}
    />
    <FormControl fullWidth>
      <Autocomplete
        multiple
        options={listOfCountries}
        getOptionLabel={(option) => option.label}
        value={listOfCountries.filter((c) =>
          form.nationalities.includes(c.code)
        )}
        onChange={(_e, value) =>
          handleChange(
            "nationalities",
            value.map((v) => v.code)
          )
        }
        disabled={!editMode}
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
          <TextField {...params} label="Nationalities" />
        )}
      />
    </FormControl>
    <TextField
      label="Date of Birth"
      type="date"
      value={form.dateOfBirth}
      onChange={(e) => handleChange("dateOfBirth", e.target.value)}
      InputLabelProps={{ shrink: true }}
      fullWidth
      disabled={!editMode}
    />
    <FormControl fullWidth>
      <Autocomplete
        multiple
        options={Object.values(Positions)}
        getOptionLabel={(option) => option}
        value={form.positions}
        onChange={(_e, value) => handleChange("positions", value)}
        disabled={!editMode}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            {option}
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return <Chip key={key} label={option} {...tagProps} />;
          })
        }
        renderInput={(params) => <TextField {...params} label="Positions" />}
      />
    </FormControl>
    <TextField
      label="Height (m)"
      type="number"
      value={form.height}
      onChange={(e) => handleChange("height", parseFloat(e.target.value))}
      fullWidth
      disabled={!editMode}
      inputProps={{ min: 1.5, max: 2.2, step: 0.01 }}
    />
  </Box>
);

export default PlayerFormFields;
