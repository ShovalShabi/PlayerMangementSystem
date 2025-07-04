package org.example.services;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.extern.slf4j.Slf4j;
import org.example.dtos.PlayerDTO;
import org.example.dtos.UpdatePlayerDTO;
import org.example.entities.NationalityEntity;
import org.example.entities.PlayerEntity;
import org.example.entities.PositionEntity;
import org.example.repositories.PlayerRepository;
import org.example.utils.classes.PositionUtils;
import org.example.utils.enums.SortBy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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

/**
 * Implementation of PlayerService interface.
 * Handles business logic for player management, including creation, update,
 * deletion, retrieval, and advanced filtering/sorting.
 */
@Slf4j
@Service
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepository playerRepository;
    private final Validator validator;

    @Autowired
    public PlayerServiceImpl(PlayerRepository playerRepository, Validator validator) {
        this.playerRepository = playerRepository;
        this.validator = validator;
    }

    /**
     * Create a new player.
     *
     * @param dto the player data
     * @return the created player
     */
    @Override
    public PlayerDTO createPlayer(PlayerDTO dto) {
        log.info("Attempting to create player: {} {}", dto.getFirstName(), dto.getLastName());

        dto.setFirstName(dto.getFirstName().strip());
        dto.setLastName(dto.getLastName().strip());

        if (dto.getDateOfBirth() == null || dto.getDateOfBirth().isAfter(LocalDate.now())) {
            log.warn("Invalid date of birth: {}", dto.getDateOfBirth());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date of birth must be in the past");
        }

        boolean exists = playerRepository.existsByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndDateOfBirth(
                dto.getFirstName(), dto.getLastName(), dto.getDateOfBirth());

        if (exists) {
            log.warn("Duplicate player detected: {} {} ({})", dto.getFirstName(), dto.getLastName(),
                    dto.getDateOfBirth());
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Player already exists");
        }

        if (dto.getHeight() == null) {
            log.warn("Rejected player due to null height value: {} {}",
                    dto.getFirstName(), dto.getLastName());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Illegal height has been provided");
        }

        if (dto.getNationalities() == null) {
            log.warn("Rejected player due to null nationalities value: {} {}",
                    dto.getFirstName(), dto.getLastName());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Illegal nationalities list has been provided");
        }

        if (dto.getPositions() == null) {
            log.warn("Rejected player due to null positions value: {} {}",
                    dto.getFirstName(), dto.getLastName());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Illegal positions list has been provided");
        }

        PlayerEntity entity = PlayerDTO.toEntity(dto);
        PlayerEntity saved = playerRepository.save(entity);
        log.info("Player created with ID: {}", saved.getId());

        return PlayerDTO.fromEntity(saved);
    }

    /**
     * Update an existing player by ID.
     *
     * @param id  the player ID
     * @param dto the updated player data
     * @return the updated player
     */
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
            existing.setFirstName(dto.getFirstName().strip());

        if (dto.getLastName() != null)
            existing.setLastName(dto.getLastName().strip());

        if (dto.getDateOfBirth() != null)
            existing.setDateOfBirth(dto.getDateOfBirth());

        if (dto.getHeight() != null)
            existing.setHeight(dto.getHeight());

        // Rebuild and link Nationalities on Set existence
        if (dto.getNationalities() != null) {
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
        if (dto.getPositions() != null) {
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

        PlayerDTO tempDTO = PlayerDTO.fromEntity(existing);
        // Checking that the player is valid after changes
        if (!validateDtoOrThrow(tempDTO, -1)) {
            log.warn("Player is not valid after changes: {}", existing);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Player is not valid after changes");
        }

        log.debug("Saving player entity: {}", existing);
        PlayerEntity saved = playerRepository.saveAndFlush(existing);

        return PlayerDTO.fromEntity(saved);
    }

    /**
     * Delete a player by ID.
     *
     * @param id the player ID
     */
    @Override
    public void deletePlayer(Long id) {
        log.info("Deleting player with ID: {}", id);
        playerRepository.deleteById(id);
    }

    /**
     * Get a player by ID.
     *
     * @param id the player ID
     * @return the player data
     */
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

    /**
     * Get a paginated list of players with advanced filtering and sorting.
     *
     * @param name          filter by full name (contains)
     * @param nationalities filter by nationalities (intersection)
     * @param minAge        minimum age (inclusive)
     * @param maxAge        maximum age (inclusive)
     * @param positions     filter by positions (intersection)
     * @param minHeight     minimum height (inclusive)
     * @param maxHeight     maximum height (inclusive)
     * @param sortBy        sorting field
     * @param order         sorting order (asc/desc)
     * @param page          page number
     * @param size          page size
     * @return paginated list of players
     */
    @Override
    public Page<PlayerDTO> getPlayers(
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
            int size) {
        Pageable pageable = PageRequest.of(page, size);
        return playerRepository.findAll((Specification<PlayerEntity>) (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Name filter
            if (name != null && !name.isBlank()) {
                Expression<String> fullName = cb.concat(cb.lower(root.get("firstName")),
                        cb.concat(" ", cb.lower(root.get("lastName"))));
                predicates.add(cb.like(fullName, "%" + name.toLowerCase() + "%"));
            }

            // Nationalities filter (intersection)
            if (nationalities != null && !nationalities.isEmpty()) {
                for (String nat : nationalities) {
                    predicates.add(cb.equal(root.join("nationalities").get("name"), nat));
                    // predicates.add(root.join("nationalities").get("name").in(nationalities));
                    // this is 'any of' sorting method
                }
            }

            // Age filter
            if (minAge != null || maxAge != null) {
                Expression<LocalDate> dob = root.get("dateOfBirth");
                LocalDate today = LocalDate.now();
                if (minAge != null) {
                    LocalDate maxDob = today.minusYears(minAge);
                    predicates.add(cb.lessThanOrEqualTo(dob, maxDob));
                }
                if (maxAge != null) {
                    LocalDate minDob = today.minusYears(maxAge + 1).plusDays(1);
                    predicates.add(cb.greaterThanOrEqualTo(dob, minDob));
                }
            }

            // Positions filter (intersection)
            if (positions != null && !positions.isEmpty()) {
                for (String pos : positions) {
                    predicates.add(cb.equal(root.join("positions").get("name"), pos.toUpperCase()));
                }
            }

            // Height filter
            if (minHeight != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("height"), minHeight));
            }
            if (maxHeight != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("height"), maxHeight));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        }, getPageableWithSort(sortBy, order, page, size)).map(PlayerDTO::fromEntity);
    }

    /**
     * Get all players.
     *
     * @return list of all players
     */
    @Override
    public List<PlayerDTO> getAll() {
        log.info("Fetching all players (DEV/TEST only)");
        return this.playerRepository
                .findAll()
                .stream()
                .map(PlayerDTO::fromEntity)
                .toList();
    }

    /**
     * Delete all players.
     */
    @Override
    public void deleteAll() {
        log.warn("Deleting all players (DEV/TEST only)");
        this.playerRepository.deleteAll();
    }

    /**
     * Bulk upload players from a CSV file.
     *
     * @param file
     * @return map of successful and failed players
     */
    @Override
    public Map<String, Object> bulkUploadPlayers(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Uploaded file is empty");
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String header = reader.readLine();
            if (header == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing header row");
            }

            String[] columns = header.split(",");
            validateCSVHeader(columns);

            List<Integer> successful = new ArrayList<>();
            List<Integer> failed = new ArrayList<>();

            String line;
            int lineNumber = 1; // 1-based line number for rows (excluding header)

            while ((line = reader.readLine()) != null) {
                lineNumber++;

                try {
                    PlayerDTO dto = parseCSVRow(line, columns);
                    boolean res = validateDtoOrThrow(dto, lineNumber);
                    if (res) {
                        createPlayer(dto);
                        successful.add(lineNumber);
                    } else
                        failed.add(lineNumber);// validation failure
                } catch (Exception e) {
                    log.warn("Failed to process line {}: {}", lineNumber, e.getMessage());
                    failed.add(lineNumber);// Exist already by first name + last name + date of birth
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("successfully_created", successful);
            result.put("failed_to_create", failed);
            return result;

        } catch (IOException e) {
            log.error("Error reading file", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error reading file");
        }
    }

    /**
     * Build a Pageable object with sorting based on the given SortBy enum and
     * order.
     *
     * @param page   page number
     * @param size   page size
     * @param sortBy sorting field
     * @param order  sorting order (asc/desc)
     * @return Pageable object with sorting
     */
    private Pageable getPageableWithSort(SortBy sortBy, String order, int page, int size) {
        Sort.Direction direction = "desc".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField;
        switch (sortBy) {
            case NAME:
                sortField = "firstName"; // You may need a custom sort for full name
                break;
            case NATIONALITY:
                sortField = "nationalities"; // May require custom logic
                break;
            case AGE:
                sortField = "dateOfBirth";
                direction = direction.isAscending() ? Sort.Direction.DESC : Sort.Direction.ASC; // Younger = later date
                break;
            case POSITIONS:
                sortField = "positions"; // May require custom logic
                break;
            case HEIGHT:
                sortField = "height";
                break;
            default:
                sortField = "id";
        }
        return PageRequest.of(page, size, Sort.by(direction, sortField));
    }

    private void validateCSVHeader(String[] columns) {
        List<String> expected = List.of("firstName", "lastName", "dateOfBirth", "height", "nationalities", "positions");
        for (String col : expected) {
            if (!Arrays.asList(columns).contains(col)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing required column: " + col);
            }
        }
    }

    /**
     * Parse a CSV row into a PlayerDTO.
     *
     * @param line
     * @param columns
     * @return PlayerDTO
     */
    private PlayerDTO parseCSVRow(String line, String[] columns) {
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

        return dto;
    }

    /**
     * Validate the DTO and throw an exception if it is invalid.
     *
     * @param dto
     * @param rowIndex
     * @return boolean of validation result
     */
    private boolean validateDtoOrThrow(PlayerDTO dto, int rowIndex) {
        Set<ConstraintViolation<PlayerDTO>> violations = validator.validate(dto);
        if (!violations.isEmpty()) {
            String errorMsg = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining("; "));
            log.error("Invalid Player structure has been occurred on bulk player add on row {}", rowIndex);
            return false;
        }
        return true;// valid DTO
    }
}