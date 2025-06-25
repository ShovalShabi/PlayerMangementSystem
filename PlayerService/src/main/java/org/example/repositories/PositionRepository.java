package org.example.repositories;

import org.example.entities.PositionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Position entities.
 * Provides CRUD operations and custom queries for Position data.
 */
@Repository
public interface PositionRepository extends JpaRepository<PositionEntity, Long> {
}