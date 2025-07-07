package org.example.repositories;

import org.example.entities.PositionEntity;
import org.example.utils.enums.Positions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Position entities.
 * Provides CRUD operations and custom queries for Position data.
 */
@Repository
public interface PositionRepository extends JpaRepository<PositionEntity, Positions> {

    /**
     * Find a position by its enum value or create a new one if it doesn't exist.
     * 
     * @param position the position enum value
     * @return the existing or newly created PositionEntity
     */
    default PositionEntity findOrCreate(Positions position) {
        Optional<PositionEntity> existing = findById(position);
        if (existing.isPresent()) {
            return existing.get();
        } else {
            PositionEntity newEntity = new PositionEntity();
            newEntity.setPosition(position);
            return save(newEntity);
        }
    }
}