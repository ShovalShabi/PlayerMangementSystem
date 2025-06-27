// src/components/PlayerModal.tsx

import React, { useEffect, useState } from "react";
import GenericModalComponent from "./GenericModalComponent";
import PlayerDTO from "../dtos/PlayerDTO";
import UpdatePlayerDTO from "../dtos/UpdatePlayerDTO";
import { Box, CircularProgress } from "@mui/material";
import useAlert from "../hooks/useAlert";
import { handleGetPlayer } from "../utils/handlers/getPlayerHandler";
import { handleCreatePlayer } from "../utils/handlers/createPlayerHandler";
import { handleUpdatePlayer } from "../utils/handlers/updatePlayerHandler";
import { handleDeletePlayer } from "../utils/handlers/deletePlayerHandler";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ConfirmationModal from "./ConfirmationModal";
import PlayerFormFields from "./player/PlayerFormFields";

type Mode = "update" | "create";

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
  const [editMode, setEditMode] = useState(true);
  const { setAlert } = useAlert();
  const [deleteMode, setDeleteMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  // Custom handleClose to reset all state
  const handleClose = () => {
    setForm(emptyPlayer);
    setEditMode(true);
    setDeleteMode(false);
    setPlayer(null);
    onClose();
  };

  // Reset deleteMode when modal opens/closes or mode changes
  useEffect(() => {
    setDeleteMode(false);
  }, [open, mode]);

  // Fetch player for preview/update
  useEffect(() => {
    if (mode === "update" && playerId && open) {
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
    if (mode === "update") {
      setShowUpdateConfirm(true);
      return;
    }
    setLoading(true);
    let result: PlayerDTO | null = null;
    if (mode === "create") {
      result = await handleCreatePlayer(form, setAlert);
    }
    setLoading(false);
    if (result) {
      onSuccess?.(result);
      onClose();
    }
  };

  // Confirmed update
  const handleConfirmedUpdate = async () => {
    setShowUpdateConfirm(false);
    if (!playerId) return;
    setLoading(true);
    const update: UpdatePlayerDTO = {
      firstName: form.firstName,
      lastName: form.lastName,
      nationalities: form.nationalities,
      positions: form.positions,
      dateOfBirth: form.dateOfBirth,
      height: form.height,
    };
    const result = await handleUpdatePlayer(playerId, update, setAlert);
    setLoading(false);
    if (result) {
      onSuccess?.(result);
      onClose();
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setShowDeleteConfirm(true);
  };

  // Confirmed delete
  const handleConfirmedDelete = async () => {
    setShowDeleteConfirm(false);
    if (!playerId) return;
    setLoading(true);
    await handleDeletePlayer(playerId, setAlert, () => {
      setLoading(false);
      onSuccess?.(form);
      onClose();
    });
    setLoading(false);
  };

  return (
    <>
      <GenericModalComponent
        open={open}
        title={mode === "update" ? "Edit Player" : "Create Player"}
        handleClose={handleClose}
        handleSubmit={
          mode === "update" && deleteMode ? handleDelete : handleSubmit
        }
        submitLabel={
          mode === "update" && deleteMode
            ? loading
              ? "Deleting..."
              : "Delete Player"
            : mode === "create"
            ? "Create Player"
            : "Update Player"
        }
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
            <PlayerFormFields
              form={form}
              editMode={editMode}
              handleChange={handleChange}
            />
            {mode === "update" && (
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={deleteMode}
                      onChange={(_, checked) => setDeleteMode(checked)}
                      color="error"
                    />
                  }
                  label="Delete this player"
                />
              </Box>
            )}
          </>
        )}
      </GenericModalComponent>
      <ConfirmationModal
        open={showDeleteConfirm}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${form.firstName} ${form.lastName}?`}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmedDelete}
        confirmLabel="Delete"
      />
      <ConfirmationModal
        open={showUpdateConfirm}
        title="Confirm Update"
        message={`Are you sure you want to update ${form.firstName} ${form.lastName}?`}
        onClose={() => setShowUpdateConfirm(false)}
        onConfirm={handleConfirmedUpdate}
        confirmLabel="Update"
      />
    </>
  );
};

export default PlayerModal;
