package org.example.controllers;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.example.dtos.PlayerDTO;
import org.example.dtos.UpdatePlayerDTO;
import org.example.services.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerService playerService;

    @Autowired
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @PostMapping
    public ResponseEntity<PlayerDTO> createPlayer(@Valid @RequestBody PlayerDTO playerDTO) {
        PlayerDTO created = playerService.createPlayer(playerDTO);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlayerDTO> updatePlayer(@PathVariable Long id,
            @Valid @RequestBody UpdatePlayerDTO playerDTO) {
        PlayerDTO updated = playerService.updatePlayer(id, playerDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerDTO> getPlayerById(@PathVariable Long id) {
        PlayerDTO player = playerService.getPlayerById(id);
        return ResponseEntity.ok(player);
    }

    @GetMapping
    public ResponseEntity<Page<PlayerDTO>> getPlayers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) List<String> nationalities,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(required = false) List<String> positions,
            @RequestParam(required = false) Double minHeight,
            @RequestParam(required = false) Double maxHeight,
            @RequestParam(required = false, defaultValue = "NAME") org.example.utils.enums.SortBy sortBy,
            @RequestParam(required = false, defaultValue = "asc") String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PlayerDTO> players = playerService.getPlayers(
                name, nationalities, minAge, maxAge, positions, minHeight, maxHeight, sortBy, order, page, size);
        return ResponseEntity.ok(players);
    }

    @PostMapping(value = "/bulk-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> bulkUpload(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(playerService.bulkUploadPlayers(file));
    }

    @GetMapping("/all")
    @Profile({ "dev", "test" })
    public ResponseEntity<List<PlayerDTO>> getAll() {
        return ResponseEntity.ok(playerService.getAll());
    }

    @DeleteMapping("/all")
    @Profile({ "dev", "test" })
    public ResponseEntity<Void> deleteAll() {
        playerService.deleteAll();
        return ResponseEntity.ok().build();
    }
}
