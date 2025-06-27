import playerService from "../../api/player-service";
import PlayerDTO from "../../dtos/PlayerDTO";
import PaginatedResponse from "../interfaces/paginated-response";

/**
 * Handles paginated player retrieval with filtering and sorting options.
 *
 * @param params Query parameters for filtering, sorting, and pagination.
 * @param setAlert Function to display alert messages to the user.
 * @returns Promise that resolves to paginated player data or null if failed.
 */
export async function handleGetPlayersBySortAndFilter(
  params: {
    name?: string;
    nationalities?: string[];
    minAge?: number;
    maxAge?: number;
    positions?: string[];
    minHeight?: number;
    maxHeight?: number;
    sortBy?: string;
    order?: string;
    page?: number;
    size?: number;
  },
  setAlert: (
    alert: {
      message: React.ReactNode;
      severity: "error" | "warning" | "info" | "success";
    } | null
  ) => void
): Promise<PaginatedResponse<PlayerDTO> | null> {
  try {
    return await playerService.getPlayers(params);
  } catch {
    setAlert({ message: "Failed to fetch players.", severity: "error" });
    return null;
  }
}
