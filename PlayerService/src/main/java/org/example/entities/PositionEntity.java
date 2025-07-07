package org.example.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.utils.enums.Positions;

import java.util.Set;

/**
 * JPA entity representing a position associated with a player.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PositionEntity {

    /**
     * Unique identifier for the position
     */
    @Id
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private Positions position;

    /**
     * Set of players associated with the position
     */
    @ManyToMany(mappedBy = "positions")
    @EqualsAndHashCode.Exclude
    private Set<PlayerEntity> players;
}
