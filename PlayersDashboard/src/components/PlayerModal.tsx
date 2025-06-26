// src/components/PlayerModal.tsx

import React, { useEffect, useState } from "react";
import GenericModalComponent from "./GenericModalComponent";
import PlayerDTO from "../dtos/PlayerDTO";
import UpdatePlayerDTO from "../dtos/UpdatePlayerDTO";
import { Positions } from "../dtos/Positions";
import listOfCountries from "../utils/objects/countries-object";
import {
  Box,
  TextField,
  MenuItem,
  Chip,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  CircularProgress,
  Button,
} from "@mui/material";
import useAlert from "../hooks/use-alert";
import { handleGetPlayer } from "../utils/handlers/getPlayerHandler";
import { handleCreatePlayer } from "../utils/handlers/createPlayerHandler";
import { handleUpdatePlayer } from "../utils/handlers/updatePlayerHandler";
import Autocomplete from "@mui/material/Autocomplete";

type Mode = "preview" | "update" | "create";

interface PlayerModalProps {
  open: boolean;
  mode: Mode;
  playerId?: number;
  onClose: () => void;
  onSuccess?: (player: PlayerDTO) => void;
}

const emptyPlayer: PlayerDTO = {
  firstName: "",
  lastName: "",
  nationalities: [],
  dateOfBirth: "",
  positions: [],
  height: 1.7,
};

const PlayerModal: React.FC<PlayerModalProps> = ({
  open,
  mode,
  playerId,
  onClose,
  onSuccess,
}) => {
  const [, setPlayer] = useState<PlayerDTO | null>(null);
  const [form, setForm] = useState<PlayerDTO>(emptyPlayer);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(
    mode === "create" || mode === "update"
  );
  const { setAlert } = useAlert();

  // Fetch player for preview/update
  useEffect(() => {
    if ((mode === "preview" || mode === "update") && playerId && open) {
      setLoading(true);
      handleGetPlayer(playerId, setAlert)
        .then((data) => {
          if (data) {
            setPlayer(data);
            setForm(data);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (mode === "create" && open) {
      setForm(emptyPlayer);
      setPlayer(null);
      setEditMode(true);
    }
  }, [mode, playerId, open, setAlert]);

  // Handle form changes
  const handleChange = (field: keyof PlayerDTO, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle submit
  const handleSubmit = async () => {
    setLoading(true);
    let result: PlayerDTO | null = null;
    if (mode === "create") {
      result = await handleCreatePlayer(form, setAlert);
    } else if (mode === "update" && playerId) {
      const update: UpdatePlayerDTO = {
        firstName: form.firstName,
        lastName: form.lastName,
        nationalities: form.nationalities,
        positions: form.positions,
        dateOfBirth: form.dateOfBirth,
        height: form.height,
      };
      result = await handleUpdatePlayer(playerId, update, setAlert);
    } else {
      setLoading(false);
      return;
    }
    setLoading(false);
    if (result) {
      onSuccess?.(result);
      onClose();
    }
  };

  // Render form fields
  const renderFields = () => (
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
            form.nationalities.includes(c.label)
          )}
          onChange={(_e, value) =>
            handleChange(
              "nationalities",
              value.map((v) => v.label)
            )
          }
          disabled={!editMode}
          renderOption={(props, option) => (
            <li {...props} key={option.code}>
              <span style={{ marginRight: 8, fontSize: 18 }}>
                {String.fromCodePoint(
                  ...[...option.code.toUpperCase()].map(
                    (c) => 0x1f1e6 + c.charCodeAt(0) - 65
                  )
                )}
              </span>
              {option.label}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                label={
                  <span>
                    <span style={{ marginRight: 6, fontSize: 16 }}>
                      {String.fromCodePoint(
                        ...[...option.code.toUpperCase()].map(
                          (c) => 0x1f1e6 + c.charCodeAt(0) - 65
                        )
                      )}
                    </span>
                    {option.label}
                  </span>
                }
                {...getTagProps({ index })}
              />
            ))
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
        <InputLabel>Positions</InputLabel>
        <Select
          multiple
          value={form.positions}
          onChange={(e) =>
            handleChange("positions", e.target.value as string[])
          }
          input={<OutlinedInput label="Positions" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {(selected as string[]).map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          disabled={!editMode}
        >
          {Object.values(Positions).map((pos) => (
            <MenuItem key={pos} value={pos}>
              {pos}
            </MenuItem>
          ))}
        </Select>
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

  return (
    <GenericModalComponent
      open={open}
      title={
        mode === "preview"
          ? "Player Preview"
          : mode === "update"
          ? "Edit Player"
          : "Create Player"
      }
      handleClose={onClose}
      handleSubmit={editMode ? handleSubmit : undefined}
      submitLabel={mode === "create" ? "Create" : "Save"}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {renderFields()}
          {mode === "preview" && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button variant="contained" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            </Box>
          )}
        </>
      )}
    </GenericModalComponent>
  );
};

export default PlayerModal;
