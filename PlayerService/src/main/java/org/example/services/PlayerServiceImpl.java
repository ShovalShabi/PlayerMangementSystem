package org.example.services;

import lombok.extern.slf4j.Slf4j;
import org.example.dtos.PlayerDTO;
import org.example.dtos.UpdatePlayerDTO;
import org.example.entities.NationalityEntity;
import org.example.entities.PlayerEntity;
import org.example.entities.PositionEntity;
import org.example.repositories.PlayerRepository;
import org.example.utils.PositionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

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
        log.info("Attempting to create player: {} {}", dto.getFirstName(), dto.getLastName());

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


        if (dto.getHeight() == null) {
            log.warn("Rejected player due to null height value: {} {}",
                    dto.getFirstName(), dto.getLastName());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Illegal height has been provided");
        }

        if (dto.getNationalities() == null){
            log.warn("Rejected player due to null nationalities value: {} {}",
                    dto.getFirstName(), dto.getLastName());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Illegal nationalities list has been provided");
        }

        if (dto.getPositions() == null){
            log.warn("Rejected player due to null positions value: {} {}",
                    dto.getFirstName(), dto.getLastName());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Illegal positions list has been provided");
        }

        PlayerEntity entity = PlayerDTO.toEntity(dto);
        PlayerEntity saved = playerRepository.save(entity);
        log.info("Player created with ID: {}", saved.getId());

        return PlayerDTO.fromEntity(saved);
    }

    @Override
    public PlayerDTO updatePlayer(Long id, UpdatePlayerDTO dto) {
        log.info("Updating player with ID: {}", id);

        PlayerEntity existing = playerRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Player not found for update: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found");
                });


        // Safe editing on non nullish values
        if (dto.getFirstName() != null)
            existing.setFirstName(dto.getFirstName());

        if (dto.getLastName() != null)
            existing.setLastName(dto.getLastName());

        if (dto.getDateOfBirth() != null)
            existing.setDateOfBirth(dto.getDateOfBirth());

        if (dto.getHeight() != null)
            existing.setHeight(dto.getHeight());

        // Rebuild and link Nationalities on Set existence
        if (dto.getNationalities() != null){
            Set<NationalityEntity> newNationalities = dto.getNationalities().stream()
                    .map(name -> {
                        NationalityEntity entity = new NationalityEntity();
                        entity.setName(name);
                        return entity;
                    })
                    .collect(Collectors.toSet());
            existing.getNationalities().clear();
            existing.getNationalities().addAll(newNationalities);
        }

        // Rebuild and link Positions on Set existence
        if (dto.getPositions() != null){
            Set<PositionEntity> newPositions = dto.getPositions().stream()
                    .map(pos -> {
                        PositionEntity entity = new PositionEntity();
                        entity.setName(pos.toUpperCase());
                        entity.setPositionGroup(PositionUtils.resolvePositionGroup(pos));
                        return entity;
                    })
                    .collect(Collectors.toSet());
            existing.getPositions().clear();
            existing.getPositions().addAll(newPositions);
        }

        log.debug("Saving player entity: {}", existing);
        PlayerEntity saved = playerRepository.saveAndFlush(existing);

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

    @Override
    public List<PlayerDTO> bulkUploadPlayers(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Uploaded file is empty");
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String header = reader.readLine();
            if (header == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing header row");
            }

            String[] columns = header.split(",");
            List<String> expected = List.of("firstName", "lastName", "dateOfBirth", "height", "nationalities", "positions");

            for (String col : expected) {
                if (!Arrays.asList(columns).contains(col)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing required column: " + col);
                }
            }

            List<PlayerDTO> createdPlayers = new ArrayList<>();
            String line;
            while ((line = reader.readLine()) != null) {
                String[] tokens = line.split(",");

                Map<String, String> data = new HashMap<>();
                for (int i = 0; i < tokens.length && i < columns.length; i++) {
                    data.put(columns[i].trim(), tokens[i].trim());
                }

                PlayerDTO dto = new PlayerDTO();
                dto.setFirstName(data.get("firstName"));
                dto.setLastName(data.get("lastName"));
                dto.setDateOfBirth(LocalDate.parse(data.get("dateOfBirth")));
                dto.setHeight(Double.parseDouble(data.get("height")));

                Set<String> nationalities = Arrays.stream(data.get("nationalities").split("[|/;#!%]"))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toSet());
                dto.setNationalities(nationalities);

                Set<String> positions = Arrays.stream(data.get("positions").split("[|/;#!%]"))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toSet());
                dto.setPositions(positions);

                createdPlayers.add(createPlayer(dto));
            }

            return createdPlayers;

        } catch (IOException e) {
            log.error("Error reading file", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error reading file");
        } catch (Exception e) {
            log.error("Bulk upload failed", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Malformed data: " + e.getMessage());
        }
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