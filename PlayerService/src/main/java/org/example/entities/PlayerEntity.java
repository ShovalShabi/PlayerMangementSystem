package org.example.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

/**
 * JPA entity representing a player in the system.
 * Contains personal details, nationalities, positions, and audit fields.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerEntity {
    /**
     * Unique identifier for the player
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Player's first name
     */
    @Column(nullable = false)
    private String firstName;

    /**
     * Player's last name
     */
    @Column(nullable = false)
    private String lastName;

    /**
     * Set of nationalities associated with the player
     */
    @ManyToMany()
    @JoinTable(name = "player_nationalities", joinColumns = @JoinColumn(name = "player_id"), inverseJoinColumns = @JoinColumn(name = "nationality"))
    @EqualsAndHashCode.Exclude
    private Set<NationalityEntity> nationalities;

    /**
     * Set of positions associated with the player
     */
    @ManyToMany()
    @JoinTable(name = "player_positions", joinColumns = @JoinColumn(name = "player_id"), inverseJoinColumns = @JoinColumn(name = "position"))
    @EqualsAndHashCode.Exclude
    private Set<PositionEntity> positions;

    /**
     * Player's date of birth
     */
    @Column(nullable = false)
    private LocalDate dateOfBirth;

    /**
     * Player's height in meters
     */
    @Column(nullable = false)
    private Double height;

    /**
     * Date when the player was created
     */
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "creation_date", nullable = false)
    private Date creationDate;

    /**
     * Date when the player was last modified
     */
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "last_modified_date", nullable = false)
    private Date lastModifiedDate;

    // Lifecycle hooks for automatic date management
    @PrePersist
    protected void onCreate() {
        this.creationDate = new Date();
        this.lastModifiedDate = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastModifiedDate = new Date();
    }
}