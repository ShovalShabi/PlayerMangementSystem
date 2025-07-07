package org.example.controllers;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.example.dtos.PlayerDTO;
import org.example.dtos.UpdatePlayerDTO;
import org.example.services.PlayerService;
import org.example.utils.enums.SortBy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST controller for managing player-related operations such as creation,
 * update, deletion, retrieval, and bulk upload.
 */
@Slf4j
@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerService playerService;

    @Autowired
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    /**
     * Create a new player.
     * using Jakarta to validate the object.
     *
     * @param playerDTO the player data
     * @return the created player
     */
    @PostMapping
    public ResponseEntity<PlayerDTO> createPlayer(@Valid @RequestBody PlayerDTO playerDTO) {
        PlayerDTO created = playerService.createPlayer(playerDTO);
        return ResponseEntity.status(201).body(created);
    }

    /**
     * Update an existing player by ID.
     *
     * @param id        the player ID
     * @param playerDTO the updated player data
     * @return the updated player
     */
    @PutMapping("/{id}")
    public ResponseEntity<PlayerDTO> updatePlayer(@PathVariable Long id,
                                                  @Valid @RequestBody UpdatePlayerDTO playerDTO) {
        PlayerDTO updated = playerService.updatePlayer(id, playerDTO);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete a player by ID.
     *
     * @param id the player ID
     * @return HTTP 200 if deleted
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Get a player by ID.
     *
     * @param id the player ID
     * @return the player data
     */
    @GetMapping("/{id}")
    public ResponseEntity<PlayerDTO> getPlayerById(@PathVariable Long id) {
        PlayerDTO player = playerService.getPlayerById(id);
        return ResponseEntity.ok(player);
    }

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
    @GetMapping
    public ResponseEntity<Page<PlayerDTO>> getPlayers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) List<String> nationalities,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(required = false) List<String> positions,
            @RequestParam(required = false) Double minHeight,
            @RequestParam(required = false) Double maxHeight,
            @RequestParam(required = false, defaultValue = "NAME") SortBy sortBy,
            @RequestParam(required = false, defaultValue = "asc") String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PlayerDTO> players = playerService.getPlayers(
                name, nationalities, minAge, maxAge, positions, minHeight, maxHeight, sortBy, order, page, size);
        return ResponseEntity.ok(players);
    }

    /**
     * Bulk upload players from a CSV file.
     *
     * @param file the CSV file
     * @return upload result
     */
    @PostMapping(value = "/bulk-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> bulkUpload(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(playerService.bulkUploadPlayers(file));
    }

    /**
     * Get all players (DEV/TEST only).
     *
     * @return list of all players
     */
    @GetMapping("/all")
    @Profile({ "dev", "test" })
    public ResponseEntity<List<PlayerDTO>> getAll() {
        return ResponseEntity.ok(playerService.getAll());
    }

    /**
     * Delete all players (DEV/TEST only).
     *
     * @return HTTP 200 if deleted
     */
    @DeleteMapping("/all")
    @Profile({ "dev", "test" })
    public ResponseEntity<Void> deleteAll() {
        playerService.deleteAll();
        return ResponseEntity.ok().build();
    }
}
