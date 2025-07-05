package org.example.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entities.NationalityEntity;
import org.example.entities.PlayerEntity;
import org.example.entities.PositionEntity;
import org.example.utils.enums.Positions;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Data Transfer Object for Player entity.
 * Encapsulates player data for API requests and responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerDTO {

        /**
         * Player ID (optional on POST request)
         */
        @PositiveOrZero(message = "Id must be zero or a positive number")
        private Long id;

        /**
         * Player's first name
         */
        @NotBlank(message = "First name must not be blank")
        @Size(max = 50, message = "First name must not exceed 50 characters")
        private String firstName;

        /**
         * Player's last name
         */
        @NotBlank(message = "Last name must not be blank")
        @Size(max = 50, message = "Last name must not exceed 50 characters")
        private String lastName;

        /**
         * Set of nationalities (must not be null or empty)
         */
        @NotNull(message = "Nationalities list cannot be null")
        @Size(min = 1, message = "At least one nationality must be provided")
        private Set<@NotBlank(message = "Nationality name must not be blank") String> nationalities;

        /**
         * Player's date of birth (must be in the past)
         */
        @Past(message = "Date of birth must be in the past")
        private LocalDate dateOfBirth;

        /**
         * Set of positions (must not be null or empty)
         */
        @NotNull(message = "Positions list cannot be null")
        @Size(min = 1, message = "At least one position must be provided")
        private Set<Positions> positions;

        /**
         * Player's height in meters (must be between 1.5 and 2.2)
         */
        @NotNull(message = "Height must be provided")
        @DecimalMin(value = "1.5", inclusive = true, message = "The player is too short to play")
        @DecimalMax(value = "2.2", inclusive = true, message = "The player is too tall to play")
        private Double height;

        /**
         * Creation date (optional on POST request)
         */
        private Date creationDate;

        /**
         * Last modified date (optional on POST request)
         */
        private Date lastModifiedDate;

        /**
         * Maps a PlayerEntity to PlayerDTO.
         *
         * @param player the PlayerEntity
         * @return the corresponding PlayerDTO
         */
        public static PlayerDTO fromEntity(PlayerEntity player) {
                Set<String> nationalities = player.getNationalities() != null
                                ? player.getNationalities().stream()
                                                .map(NationalityEntity::getName)
                                                .collect(Collectors.toSet())
                                : null;

                Set<Positions> positions = player.getPositions() != null
                                ? player.getPositions().stream()
                                                .map(PositionEntity::getPosition)
                                                .collect(Collectors.toSet())
                                : null;

                return new PlayerDTO(
                                player.getId(), // can be null or populated value
                                player.getFirstName(),
                                player.getLastName(),
                                nationalities,
                                player.getDateOfBirth(),
                                positions,
                                player.getHeight(),
                                player.getCreationDate(),
                                player.getLastModifiedDate());
        }

        /**
         * Maps a PlayerDTO to PlayerEntity.
         *
         * @param dto the PlayerDTO
         * @return the corresponding PlayerEntity
         */
        public static PlayerEntity toEntity(PlayerDTO dto) {
                Set<NationalityEntity> nationalityEntities = dto.getNationalities() != null
                                ? dto.getNationalities().stream()
                                                .map(name -> new NationalityEntity(null, name))
                                                .collect(Collectors.toSet())
                                : null;

                Set<PositionEntity> positionEntities = dto.getPositions() != null
                                ? dto.getPositions().stream()
                                                .map(position -> new PositionEntity(null, position))
                                                .collect(Collectors.toSet())
                                : null;

                return new PlayerEntity(
                                dto.getId(), // can be null or populated value
                                dto.getFirstName(),
                                dto.getLastName(),
                                nationalityEntities,
                                positionEntities,
                                dto.getDateOfBirth(),
                                dto.getHeight(),
                                null,
                                null);
        }
}
