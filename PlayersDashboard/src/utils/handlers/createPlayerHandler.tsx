import { isAxiosError } from "axios";
import playerService from "../../api/player-service";
import PlayerDTO from "../../dtos/PlayerDTO";
import React from "react";

export async function handleCreatePlayer(
  data: PlayerDTO,
  setAlert: (
    alert: {
      message: React.ReactNode;
      severity: "error" | "warning" | "info" | "success";
    } | null
  ) => void,
  onSuccess?: (player: PlayerDTO) => void
): Promise<PlayerDTO | null> {
  try {
    const result = await playerService.createPlayer(data);
    setAlert({ message: "Player created successfully!", severity: "success" });
    if (onSuccess) onSuccess(result);
    return result;
  } catch (e: unknown) {
    if (isAxiosError(e)) {
      setAlert({
        message: e.response?.data || "Failed to submit player.",
        severity: "error",
      });
    } else {
      setAlert({ message: "Failed to submit player.", severity: "error" });
    }
    return null;
  }
}
