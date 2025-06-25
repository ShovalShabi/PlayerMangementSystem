package org.example.services;

import org.example.dtos.PlayerDTO;
import org.example.dtos.UpdatePlayerDTO;
import org.example.utils.enums.SortBy;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Service interface for player management business logic.
 */
public interface PlayerService {
    /**
     * Create a new player.
     *
     * @param playerDTO the player data
     * @return the created player
     */
    PlayerDTO createPlayer(PlayerDTO playerDTO);

    /**
     * Update an existing player by ID.
     *
     * @param id        the player ID
     * @param playerDTO the updated player data
     * @return the updated player
     */
    PlayerDTO updatePlayer(Long id, UpdatePlayerDTO playerDTO);

    /**
     * Delete a player by ID.
     *
     * @param id the player ID
     */
    void deletePlayer(Long id);

    /**
     * Get a player by ID.
     *
     * @param id the player ID
     * @return the player data
     */
    PlayerDTO getPlayerById(Long id);

    /**
     * Get a paginated list of players with advanced filtering and sorting.
     *
     * @param name          filter by full name (first + last)
     * @param nationalities filter by nationalities (intersection)
     * @param minAge        minimum age
     * @param maxAge        maximum age
     * @param positions     filter by positions (intersection)
     * @param minHeight     minimum height
     * @param maxHeight     maximum height
     * @param sortBy        sorting field
     * @param order         sorting order (asc/desc)
     * @param page          page number
     * @param size          page size
     * @return paginated list of players
     */
    Page<PlayerDTO> getPlayers(
            String name,
            List<String> nationalities,
            Integer minAge,
            Integer maxAge,
            List<String> positions,
            Double minHeight,
            Double maxHeight,
            SortBy sortBy,
            String order,
            int page,
            int size);

    /**
     * Bulk upload players from a CSV file.
     *
     * @param file the CSV file
     * @return upload result
     */
    Map<String, Object> bulkUploadPlayers(MultipartFile file);

    /**
     * Get all players (DEV/TEST only).
     *
     * @return list of all players
     */
    List<PlayerDTO> getAll();

    /**
     * Delete all players (DEV/TEST only).
     */
    void deleteAll();
}