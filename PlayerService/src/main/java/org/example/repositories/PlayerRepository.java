package org.example.repositories;

import org.example.entities.PlayerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for Player entities.
 * Provides CRUD operations and custom queries for Player data.
 */
@Repository
public interface PlayerRepository extends JpaRepository<PlayerEntity, Long>, JpaSpecificationExecutor<PlayerEntity> {

    boolean existsByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndDateOfBirth(String firstName, String lastName,
            LocalDate dateOfBirth);

    /**
     * Find all players with their nationalities and positions eagerly loaded.
     * This prevents the N+1 query problem.
     */
    @Query("SELECT DISTINCT p FROM PlayerEntity p " +
            "LEFT JOIN FETCH p.nationalities " +
            "LEFT JOIN FETCH p.positions")
    List<PlayerEntity> findAllWithNationalitiesAndPositions();

    /**
     * Find a player by ID with nationalities and positions eagerly loaded.
     */
    @Query("SELECT p FROM PlayerEntity p WHERE p.id = :id")
    PlayerEntity findByIdWithNationalitiesAndPositions(Long id);
}