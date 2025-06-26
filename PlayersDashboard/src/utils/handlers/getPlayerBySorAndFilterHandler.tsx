import playerService from "../../api/player-service";
import PlayerDTO from "../../dtos/PlayerDTO";
import PaginatedResponse from "../interfaces/paginated-response";

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
