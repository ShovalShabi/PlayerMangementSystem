package org.example.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

/**
 * Data Transfer Object for updating Player entity.
 * Used for PATCH/PUT requests to update player data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePlayerDTO {
    /**
     * Player's first name (optional)
     */
    private String firstName;
    /**
     * Player's last name (optional)
     */
    private String lastName;
    /**
     * Set of nationalities (optional)
     */
    private Set<String> nationalities;
    /**
     * Set of positions (optional)
     */
    private Set<String> positions;
    /**
     * Player's date of birth (optional)
     */
    private LocalDate dateOfBirth;
    /**
     * Player's height in meters (optional)
     */
    private Double height;
}