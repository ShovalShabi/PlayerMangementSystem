import playerService from "../../api/player-service";

/**
 * Handles CSV file upload for bulk player creation.
 *
 * @param file The CSV file to upload (null if no file selected).
 * @param setAlert Function to display alert messages to the user.
 * @param onSuccess Optional callback to execute on successful upload.
 * @returns Promise that resolves when upload is complete.
 */
export async function handleUploadCsv(
  file: File | null,
  setAlert: (
    alert: {
      message: React.ReactNode;
      severity: "error" | "warning" | "info" | "success";
    } | null
  ) => void,
  onSuccess?: () => void
): Promise<void> {
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
  } catch (error) {
    const message = "Failed to upload CSV.";
    setAlert({ message, severity: "error" });
    throw error; // Re-throw to ensure the promise rejects
  }
}
