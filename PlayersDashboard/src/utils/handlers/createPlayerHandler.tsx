import { isAxiosError } from "axios";
import playerService from "../../api/player-service";
import PlayerDTO from "../../dtos/PlayerDTO";
import React from "react";

/**
 * Handles player creation operations with error handling and user feedback.
 *
 * @param data The player data to create.
 * @param setAlert Function to display alert messages to the user.
 * @param onSuccess Optional callback to execute on successful creation.
 * @returns Promise that resolves to the created player or null if failed.
 */
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
      let errorMessage = "Failed to submit player.";
      if (e.response?.data) {
        if (typeof e.response.data === "object") {
          // Handle validation error object
          const errorObj = e.response.data as Record<string, string>;
          errorMessage = Object.values(errorObj).join(", ");
        } else {
          errorMessage = e.response.data as string;
        }
      }
      setAlert({
        message: errorMessage,
        severity: "error",
      });
    } else {
      setAlert({ message: "Failed to submit player.", severity: "error" });
    }
    return null;
  }
}
