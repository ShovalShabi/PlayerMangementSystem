package org.example.repositories;

import org.example.entities.NationalityEntity;
import org.example.utils.enums.Nationality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Nationality entities.
 * Provides CRUD operations and custom queries for Nationality data.
 */
@Repository
public interface NationalityRepository extends JpaRepository<NationalityEntity, Nationality> {

    /**
     * Find a nationality by its enum value or create a new one if it doesn't exist.
     * 
     * @param nationality the nationality enum value
     * @return the existing or newly created NationalityEntity
     */
    default NationalityEntity findOrCreate(Nationality nationality) {
        Optional<NationalityEntity> existing = findById(nationality);
        if (existing.isPresent()) {
            return existing.get();
        } else {
            NationalityEntity newEntity = new NationalityEntity();
            newEntity.setNationality(nationality);
            return save(newEntity);
        }
    }
}