package org.example.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.utils.enums.Positions;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Position enum value (e.g., CB, LB, ST)
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Positions position;
}
