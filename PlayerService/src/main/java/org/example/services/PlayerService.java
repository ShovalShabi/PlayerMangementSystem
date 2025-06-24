package org.example.services;

import org.example.dtos.PlayerDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PlayerService {
    PlayerDTO createPlayer(PlayerDTO playerDTO);

    PlayerDTO updatePlayer(Long id, PlayerDTO playerDTO);

    void deletePlayer(Long id);

    PlayerDTO getPlayerById(Long id);

    Page<PlayerDTO> getPlayers(String firstName, String lastName, String nationality, String position,
                               String sortBy, String order, int page, int size);

    List<PlayerDTO> bulkUploadPlayers(MultipartFile file);

    List<PlayerDTO> getAll();

    void deleteAll();
}