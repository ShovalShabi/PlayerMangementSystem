package org.example.repositories;

import org.example.entities.PlayerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface PlayerRepository extends JpaRepository<PlayerEntity, Long>, JpaSpecificationExecutor<PlayerEntity> {

    boolean existsByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndDateOfBirth(String firstName, String lastName, LocalDate dateOfBirth);

}