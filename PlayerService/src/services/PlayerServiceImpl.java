package services;

import dtos.PlayerDTO;
import entities.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import repositories.PlayerRepository;

import java.util.Collections;
import java.util.List;

@Service
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepository playerRepository;

    @Autowired
    public PlayerServiceImpl(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Override
    public PlayerDTO createPlayer(PlayerDTO playerDTO) {
        return null;
    }

    @Override
    public PlayerDTO updatePlayer(Long id, PlayerDTO playerDTO) {
        return null;
    }

    @Override
    public void deletePlayer(Long id) {
    }

    @Override
    public PlayerDTO getPlayerById(Long id) {
        return null;
    }

    @Override
    public List<PlayerDTO> getPlayers(String firstName, String lastName, String nationality, String position,
            String sortBy, String order) {
        return Collections.emptyList();
    }

    @Override
    public List<PlayerDTO> bulkUploadPlayers(MultipartFile file) {
        return Collections.emptyList();
    }
}