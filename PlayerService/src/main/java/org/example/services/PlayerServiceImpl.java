package org.example.services;

import lombok.extern.slf4j.Slf4j;
import org.example.dtos.PlayerDTO;
import org.example.entities.NationalityEntity;
import org.example.entities.PlayerEntity;
import org.example.entities.PositionEntity;
import org.example.repositories.PlayerRepository;
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

    @Autowired
    public PlayerServiceImpl(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Override
    public PlayerDTO createPlayer(PlayerDTO dto) {
        log.info("Creating player: {} {}", dto.getFirstName(), dto.getLastName());

        if (dto.getDateOfBirth() == null || dto.getDateOfBirth().isAfter(LocalDate.now())) {
            log.warn("Invalid date of birth: {}", dto.getDateOfBirth());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date of birth must be in the past");
        }

        boolean exists = playerRepository.existsByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndDateOfBirth(
                dto.getFirstName(), dto.getLastName(), dto.getDateOfBirth());

        if (exists) {
            log.warn("Duplicate player detected: {} {} ({})", dto.getFirstName(), dto.getLastName(), dto.getDateOfBirth());
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Player already exists");
        }

        if (dto.getHeight() < 1.4) {
            log.warn("Rejected player due to short height: {} {} ({}m)",
                    dto.getFirstName(), dto.getLastName(), dto.getHeight());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The player is too short haha! :D");
        }

        PlayerEntity entity = PlayerDTO.toEntity(dto);
        PlayerEntity saved = playerRepository.save(entity);
        log.info("Player created with ID: {}", saved.getId());

        return PlayerDTO.fromEntity(saved);
    }

    @Override
    public PlayerDTO updatePlayer(Long id, PlayerDTO dto) {
        log.info("Updating player with ID: {}", id);

        PlayerEntity existing = playerRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Player not found for update: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found");
                });

        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setDateOfBirth(dto.getDateOfBirth());

        if (dto.getHeight() < 1.4) {
            log.warn("Rejected player due to short height: {} {} ({}m)",
                    dto.getFirstName(), dto.getLastName(), dto.getHeight());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The player is too short haha! :D");
        }

        existing.setHeight(dto.getHeight());

        //TODO: need to fix the null assignment
        existing.setNationalities(dto.getNationalities().stream()
                .map(n -> new NationalityEntity(null, n))
                .toList());

        //TODO: need to fix the null assignment
        existing.setPositions(dto.getPositions().stream()
                .map(code -> {
                    Positions group = PositionUtils.resolvePositionGroup(code);
                    return new PositionEntity(null, group, code.toUpperCase());
                })
                .toList());
        System.err.println(existing);
        PlayerEntity saved = playerRepository.saveAndFlush(existing);
        System.err.println("Saved nationalities: " + saved.getNationalities());
        System.err.println("Saved positions: " + saved.getPositions());
        log.info("Player updated: ID {}", saved.getId());

        return PlayerDTO.fromEntity(saved);
    }

    @Override
    public void deletePlayer(Long id) {
        log.info("Deleting player with ID: {}", id);
        playerRepository.deleteById(id);
    }

    @Override
    public PlayerDTO getPlayerById(Long id) {
        log.info("Fetching player by ID: {}", id);
        return playerRepository.findById(id)
                .map(PlayerDTO::fromEntity)
                .orElseThrow(() -> {
                    log.warn("Player not found: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found");
                });
    }

    //TODO: Need to fix intersection by all filters
    @Override
    public Page<PlayerDTO> getPlayers(String firstName, String lastName, String nationality, String position,
                                      String sortBy, String order, int page, int size) {
        log.info("Fetching players with filters [firstName: {}, lastName: {}, nationality: {}, position: {}], page {}, size {}",
                firstName, lastName, nationality, position, page, size);

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

        log.info("Fetched {} players", result.getTotalElements());
        return result.map(PlayerDTO::fromEntity);
    }

    //TODO: need to implement this
    @Override
    public List<PlayerDTO> bulkUploadPlayers(MultipartFile file) {
        log.warn("Bulk upload not implemented yet");
        return Collections.emptyList();
    }

    @Override
    public List<PlayerDTO> getAll() {
        log.info("Fetching all players (DEV/TEST only)");
        return this.playerRepository
                .findAll()
                .stream()
                .map(PlayerDTO::fromEntity)
                .toList();
    }

    @Override
    public void deleteAll() {
        log.warn("Deleting all players (DEV/TEST only)");
        this.playerRepository.deleteAll();
    }
}