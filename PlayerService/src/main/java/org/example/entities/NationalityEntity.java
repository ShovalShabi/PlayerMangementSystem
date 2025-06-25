package org.example.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * JPA entity representing a nationality associated with a player.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NationalityEntity {

    /**
     * Unique identifier for the nationality
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Name of the nationality
     */
    @Column(nullable = false)
    private String name;
}