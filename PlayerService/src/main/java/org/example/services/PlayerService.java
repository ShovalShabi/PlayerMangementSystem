package org.example.services;

import org.example.dtos.PlayerDTO;
import org.example.dtos.UpdatePlayerDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface PlayerService {
    PlayerDTO createPlayer(PlayerDTO playerDTO);

    PlayerDTO updatePlayer(Long id, UpdatePlayerDTO playerDTO);

    void deletePlayer(Long id);

    PlayerDTO getPlayerById(Long id);

    Page<PlayerDTO> getPlayers(String firstName, String lastName, String nationality, String position,
                               String sortBy, String order, int page, int size);

    Map<String, Object> bulkUploadPlayers(MultipartFile file);

    List<PlayerDTO> getAll();

    void deleteAll();
}