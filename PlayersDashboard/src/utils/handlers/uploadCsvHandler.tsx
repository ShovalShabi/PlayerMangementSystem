import playerService from "../../api/player-service";

export async function handleUploadCsv(
  file: File | null,
  setAlert: (
    alert: {
      message: React.ReactNode;
      severity: "error" | "warning" | "info" | "success";
    } | null
  ) => void,
  onSuccess?: () => void
) {
  if (!file) return;
  try {
    const result = await playerService.bulkUpload(file);
    setAlert({
      message: (
        <span>
          Successfully created: {result.successfully_created.length} rows.
          <br />
          Failed to create: {result.failed_to_create.length} rows.
        </span>
      ),
      severity: "success",
    });
    if (onSuccess) onSuccess();
  } catch {
    const message = "Failed to upload CSV.";
    setAlert({ message, severity: "error" });
  }
}
