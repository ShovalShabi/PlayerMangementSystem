import playerService from "../../api/player-service";

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
