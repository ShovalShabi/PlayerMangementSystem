import axios from "axios";
import PlayerDTO from "../dtos/PlayerDTO";
import UpdatePlayerDTO from "../dtos/UpdatePlayerDTO";
import PaginatedResponse from "../utils/interfaces/paginated-response";
import CsvUploadResponse from "../utils/interfaces/csv-upload-response";
import getEnvVariables from "../etc/load-env-variables";

const { playerServiceURL } = getEnvVariables();

/**
 * Custom parameter serializer for Spring Boot compatibility.
 * Handles array parameters by repeating the key for each value.
 *
 * @param params Object containing query parameters.
 * @returns URL-encoded query string compatible with Spring Boot.
 */
const paramsSerializer = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return; // Skip undefined/null values
    }

    if (Array.isArray(value)) {
      // For arrays, add each value as a separate parameter with the same name
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item));
        }
      });
    } else {
      // For non-arrays, add as single parameter
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

/**
 * Wrapper function for API requests that provides consistent error handling.
 *
 * @template T The expected return type of the request.
 * @param request The async function to execute.
 * @returns Promise that resolves to the request result or throws an error.
 */
async function requestWrapper<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Re-throw the Axios error for the caller to handle
      throw error;
    }
    // If it's not an AxiosError, throw a generic error
    throw new Error("An unexpected error occurred");
  }
}

/**
 * Player service API client for communicating with the backend player service.
 * Provides methods for CRUD operations, filtering, and bulk upload functionality.
 */
const playerService = {
  /**
   * Creates a new player.
   * @param player The player data to create.
   * @returns Promise that resolves to the created player.
   */
  createPlayer: async (player: PlayerDTO): Promise<PlayerDTO> => {
    return requestWrapper(async () => {
      const response = await axios.post(`${playerServiceURL}`, player);
      return response.data as PlayerDTO;
    });
  },

  /**
   * Updates an existing player by ID.
   * @param id The player ID to update.
   * @param player The updated player data.
   * @returns Promise that resolves to the updated player.
   */
  updatePlayer: async (
    id: number,
    player: UpdatePlayerDTO
  ): Promise<PlayerDTO> => {
    return requestWrapper(async () => {
      const response = await axios.put(`${playerServiceURL}/${id}`, player);
      return response.data as PlayerDTO;
    });
  },

  /**
   * Deletes a player by ID.
   * @param id The player ID to delete.
   * @returns Promise that resolves when deletion is complete.
   */
  deletePlayer: async (id: number): Promise<void> => {
    return requestWrapper(async () => {
      await axios.delete(`${playerServiceURL}/${id}`);
    });
  },

  /**
   * Retrieves a player by ID.
   * @param id The player ID to retrieve.
   * @returns Promise that resolves to the player data.
   */
  getPlayerById: async (id: number): Promise<PlayerDTO> => {
    return requestWrapper(async () => {
      const response = await axios.get(`${playerServiceURL}/${id}`);
      return response.data as PlayerDTO;
    });
  },

  /**
   * Retrieves a paginated list of players with optional filtering and sorting.
   * @param params Query parameters for filtering, sorting, and pagination.
   * @returns Promise that resolves to a paginated response of players.
   */
  getPlayers: async (params: {
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
  }): Promise<PaginatedResponse<PlayerDTO>> => {
    return requestWrapper(async () => {
      const response = await axios.get(`${playerServiceURL}`, {
        params,
        paramsSerializer,
      });
      return response.data;
    });
  },

  /**
   * Uploads a CSV file for bulk player creation.
   * @param file The CSV file to upload.
   * @returns Promise that resolves to the upload response with results.
   */
  bulkUpload: async (file: File): Promise<CsvUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    return requestWrapper(async () => {
      const response = await axios.post(
        `${playerServiceURL}/bulk-upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    });
  },
};

export default playerService;
