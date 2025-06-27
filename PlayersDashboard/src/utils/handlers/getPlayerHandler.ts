import { isAxiosError } from "axios";
import playerService from "../../api/player-service";
import PlayerDTO from "../../dtos/PlayerDTO";
import React from "react";

/**
 * Handles single player retrieval operations with error handling and user feedback.
 *
 * @param id The player ID to retrieve.
 * @param setAlert Function to display alert messages to the user.
 * @returns Promise that resolves to the player data or null if failed.
 */
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
        message: e.response?.data || "Failed to retrieve player.",
        severity: "error",
      });
    } else {
      setAlert({ message: "Failed to retrieve player.", severity: "error" });
    }
    return null;
  }
}
