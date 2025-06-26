import { isAxiosError } from "axios";
import playerService from "../../api/player-service";
import UpdatePlayerDTO from "../../dtos/UpdatePlayerDTO";
import PlayerDTO from "../../dtos/PlayerDTO";
import React from "react";

export async function handleUpdatePlayer(
  id: number,
  data: UpdatePlayerDTO,
  setAlert: (
    alert: {
      message: React.ReactNode;
      severity: "error" | "warning" | "info" | "success";
    } | null
  ) => void,
  onSuccess?: (player: PlayerDTO) => void
): Promise<PlayerDTO | null> {
  try {
    const result = await playerService.updatePlayer(id, data);
    setAlert({ message: "Player updated successfully!", severity: "success" });
    if (onSuccess) onSuccess(result);
    return result;
  } catch (e: unknown) {
    if (isAxiosError(e)) {
      setAlert({
        message: e.response?.data?.message || "Failed to submit player.",
        severity: "error",
      });
    } else {
      setAlert({ message: "Failed to submit player.", severity: "error" });
    }
    return null;
  }
}
