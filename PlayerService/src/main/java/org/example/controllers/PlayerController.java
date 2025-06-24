package org.example.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dtos.PlayerDTO;
import org.example.services.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<PlayerDTO> createPlayer(@RequestBody PlayerDTO playerDTO) {
        PlayerDTO created = playerService.createPlayer(playerDTO);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlayerDTO> updatePlayer(@PathVariable Long id, @RequestBody PlayerDTO playerDTO) {
        PlayerDTO updated = playerService.updatePlayer(id, playerDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerDTO> getPlayerById(@PathVariable Long id) {
        PlayerDTO player = playerService.getPlayerById(id);
        return ResponseEntity.ok(player);
    }

    @GetMapping
    public ResponseEntity<Page<PlayerDTO>> getPlayers(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String nationality,
            @RequestParam(required = false) String position,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<PlayerDTO> players = playerService.getPlayers(
                firstName, lastName, nationality, position, sortBy, order, page, size);

        return ResponseEntity.ok(players);
    }

    @PostMapping("/bulk-upload")
    public ResponseEntity<?> bulkUpload(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(playerService.bulkUploadPlayers(file));
    }
}
