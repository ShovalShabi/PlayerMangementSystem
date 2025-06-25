package org.example.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entities.NationalityEntity;
import org.example.entities.PlayerEntity;
import org.example.entities.PositionEntity;
import org.example.utils.classes.PositionUtils;
import org.example.utils.enums.Positions;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerDTO {

    @PositiveOrZero(message = "Id must be zero or a positive number")
    private Long id; // Optional on POST request

    @NotBlank(message = "First name must not be blank")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name must not be blank")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @NotNull(message = "Nationalities list cannot be null")
    @Size(min = 1, message = "At least one nationality must be provided")
    private Set<@NotBlank(message = "Nationality name must not be blank") String> nationalities;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotNull(message = "Positions list cannot be null")
    @Size(min = 1, message = "At least one position must be provided")
    private Set<@NotBlank(message = "Position name must not be blank") String> positions;

    @NotNull(message = "Height must be provided")
    @DecimalMin(value = "1.5", inclusive = true, message = "The player is too short to play")
    @DecimalMax(value = "2.2", inclusive = true, message = "The player is too tall to play")
    private Double height; // Measured with Meters

    private Date creationDate; // Optional on POST request

    private Date lastModifiedDate; // Optional on POST request

    public static PlayerDTO fromEntity(PlayerEntity player) {
        Set<String> nationalities = player.getNationalities() != null
                ? player.getNationalities().stream()
                .map(NationalityEntity::getName)
                .collect(Collectors.toSet())
                : null;

        Set<String> positions = player.getPositions() != null
                ? player.getPositions().stream()
                .map(PositionEntity::getName)
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

    public static PlayerEntity toEntity(PlayerDTO dto) {
        Set<NationalityEntity> nationalityEntities = dto.getNationalities() != null
                ? dto.getNationalities().stream()
                .map(name -> new NationalityEntity(null, name))
                .collect(Collectors.toSet())
                : null;

        Set<PositionEntity> positionEntities = dto.getPositions() != null
                ? dto.getPositions().stream()
                .map(code -> {
                    Positions group = PositionUtils.resolvePositionGroup(code);
                    return new PositionEntity(null, group, code.toUpperCase());
                })
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
