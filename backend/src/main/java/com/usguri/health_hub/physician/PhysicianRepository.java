package com.usguri.health_hub.physician;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PhysicianRepository extends JpaRepository<Physician, Long> {

    @Query("SELECT p FROM Physician p WHERE p.email =?1")
    Optional<Physician> findPhysicianByEmail(String email);

}
