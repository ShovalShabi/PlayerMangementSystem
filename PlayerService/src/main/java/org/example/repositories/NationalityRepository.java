package org.example.repositories;

import org.example.entities.NationalityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NationalityRepository extends JpaRepository<NationalityEntity, Long> {
}