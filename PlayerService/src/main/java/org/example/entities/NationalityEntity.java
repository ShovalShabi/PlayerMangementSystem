package org.example.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.utils.enums.Nationality;

import java.util.Set;

/**
 * JPA entity representing a nationality associated with a player.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NationalityEntity {

    /**
     * Unique identifier for the nationality which is the ISO 3166-1 alpha-2 code
     */
    @Id
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private Nationality nationality;

    /**
     * Set of players associated with the nationality
     */
    @ManyToMany(mappedBy = "nationalities")
    @EqualsAndHashCode.Exclude
    private Set<PlayerEntity> players;
}