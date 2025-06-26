import { isAxiosError } from "axios";
import playerService from "../../api/player-service";
import PlayerDTO from "../../dtos/PlayerDTO";
import React from "react";

export async function handleGetPlayer(
  id: number,
  setAlert: (
    alert: {
      message: React.ReactNode;
      severity: "error" | "warning" | "info" | "success";
    } | null
  ) => void
): Promise<PlayerDTO | null> {
  try {
    const player = await playerService.getPlayerById(id);
    return player;
  } catch (e: unknown) {
    if (isAxiosError(e)) {
      setAlert({
        message: e.response?.data?.message || "Failed to retrieve player.",
        severity: "error",
      });
    } else {
      setAlert({ message: "Failed to retrieve player.", severity: "error" });
    }
    return null;
  }
}
