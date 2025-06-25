package org.example.repositories;

import org.example.entities.NationalityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Nationality entities.
 * Provides CRUD operations and custom queries for Nationality data.
 */
@Repository
public interface NationalityRepository extends JpaRepository<NationalityEntity, Long> {
}