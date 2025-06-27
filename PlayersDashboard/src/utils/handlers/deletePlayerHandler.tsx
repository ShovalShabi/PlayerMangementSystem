import playerService from "../../api/player-service";

/**
 * Handles player deletion operations with error handling and user feedback.
 *
 * @param id The player ID to delete.
 * @param setAlert Function to display alert messages to the user.
 * @param onSuccess Optional callback to execute on successful deletion.
 * @returns Promise that resolves when deletion is complete.
 */
export async function handleDeletePlayer(
  id: number,
  setAlert: (
    alert: {
      message: React.ReactNode;
      severity: "error" | "warning" | "info" | "success";
    } | null
  ) => void,
  onSuccess?: () => void
): Promise<void> {
  try {
    await playerService.deletePlayer(id);
    setAlert({ message: "Player deleted successfully.", severity: "success" });
    if (onSuccess) onSuccess();
  } catch {
    setAlert({ message: "Failed to delete player.", severity: "error" });
  }
}
