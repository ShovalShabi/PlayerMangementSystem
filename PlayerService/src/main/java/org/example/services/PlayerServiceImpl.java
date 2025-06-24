package org.example.services;

import lombok.extern.slf4j.Slf4j;
import org.example.dtos.PlayerDTO;
import org.example.entities.NationalityEntity;
import org.example.entities.PlayerEntity;
import org.example.entities.PositionEntity;
import org.example.repositories.NationalityRepository;
import org.example.repositories.PlayerRepository;
import org.example.repositories.PositionRepository;
import org.example.utils.PositionUtils;
import org.example.utils.Positions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepository playerRepository;
    private NationalityRepository nationalityRepository;
    private PositionRepository positionRepository;

    @Autowired
    public PlayerServiceImpl(PlayerRepository playerRepository, NationalityRepository nationalityRepository, PositionRepository positionRepository) {
        this.playerRepository = playerRepository;
        this.nationalityRepository = nationalityRepository;
        this.positionRepository = positionRepository;
    }

    @Override
    public PlayerDTO createPlayer(PlayerDTO dto) {
        if (dto.getDateOfBirth() == null || dto.getDateOfBirth().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date of birth must be in the past");
        }

        boolean exists = playerRepository.existsByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndDateOfBirth(
                dto.getFirstName(), dto.getLastName(), dto.getDateOfBirth());

        if (exists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Player already exists");
        }

        PlayerEntity entity = PlayerDTO.toEntity(dto);
        return PlayerDTO.fromEntity(playerRepository.save(entity));
    }


    @Override
    public PlayerDTO updatePlayer(Long id, PlayerDTO dto) {
        PlayerEntity existing = playerRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));

        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setDateOfBirth(dto.getDateOfBirth());

        if (dto.getHeight() < 1.4) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The player is too short haha! :D"
            );
        }

        existing.setHeight(dto.getHeight());

        existing.setNationalities(dto.getNationalities().stream()
                .map(n -> new NationalityEntity(null, n))
                .toList());

        existing.setPositions(dto.getPositions().stream()
                .map(code -> {
                    Positions group = PositionUtils.resolvePositionGroup(code);
                    return new PositionEntity(null, group, code.toUpperCase());
                })
                .toList());

        return PlayerDTO.fromEntity(playerRepository.save(existing));
    }


    @Override
    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }

    @Override
    public PlayerDTO getPlayerById(Long id) {
        return playerRepository.findById(id)
                .map(PlayerDTO::fromEntity)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));
    }


    @Override
    public Page<PlayerDTO> getPlayers(String firstName, String lastName, String nationality, String position,
                                      String sortBy, String order, int page, int size) {

        Sort.Direction direction = "desc".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy == null ? "id" : sortBy));

        Page<PlayerEntity> result = playerRepository.findAll((root, query, cb) -> {
            var predicates = cb.conjunction();

            if (firstName != null && !firstName.isBlank()) {
                predicates.getExpressions().add(cb.like(cb.lower(root.get("firstName")), "%" + firstName.toLowerCase() + "%"));
            }
            if (lastName != null && !lastName.isBlank()) {
                predicates.getExpressions().add(cb.like(cb.lower(root.get("lastName")), "%" + lastName.toLowerCase() + "%"));
            }
            if (nationality != null && !nationality.isBlank()) {
                predicates.getExpressions().add(cb.isMember(new NationalityEntity(null, nationality), root.get("nationalities")));
            }
            if (position != null && !position.isBlank()) {
                predicates.getExpressions().add(cb.isMember(
                        new PositionEntity(null, PositionUtils.resolvePositionGroup(position), position.toUpperCase()),
                        root.get("positions")));
            }

            return predicates;
        }, pageable);

        return result.map(PlayerDTO::fromEntity);
    }

    @Override
    public List<PlayerDTO> bulkUploadPlayers(MultipartFile file) {
        return Collections.emptyList();
    }

    @Override
    public List<PlayerDTO> getAll() {
        return this.playerRepository
                .findAll()
                .stream()
                .map(PlayerDTO::fromEntity)
                .toList();
    }

    @Override
    public void deleteAll() {
        this.playerRepository.deleteAll();
    }
}