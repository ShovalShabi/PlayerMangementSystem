import axios from "axios";
import PlayerDTO from "../dtos/PlayerDTO";
import UpdatePlayerDTO from "../dtos/UpdatePlayerDTO";
import PaginatedResponse from "../utils/interfaces/paginated-response";
import CsvUploadResponse from "../utils/interfaces/csv-upload-response";
import getEnvVariables from "../etc/load-env-variables";

const { playerServiceURL } = getEnvVariables();

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
const playerService = {
  createPlayer: async (player: PlayerDTO): Promise<PlayerDTO> => {
    return requestWrapper(async () => {
      const response = await axios.post(`${playerServiceURL}`, player);
      return response.data as PlayerDTO;
    });
  },

  updatePlayer: async (
    id: number,
    player: UpdatePlayerDTO
  ): Promise<PlayerDTO> => {
    return requestWrapper(async () => {
      const response = await axios.put(`${playerServiceURL}/${id}`, player);
      return response.data as PlayerDTO;
    });
  },

  deletePlayer: async (id: number): Promise<void> => {
    return requestWrapper(async () => {
      await axios.delete(`${playerServiceURL}/${id}`);
    });
  },

  getPlayerById: async (id: number): Promise<PlayerDTO> => {
    return requestWrapper(async () => {
      const response = await axios.get(`${playerServiceURL}/${id}`);
      return response.data as PlayerDTO;
    });
  },

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
      const response = await axios.get(`${playerServiceURL}`, { params });
      return response.data;
    });
  },

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
