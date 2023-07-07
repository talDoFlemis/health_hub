package com.usguri.health_hub.physician;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhysicianRepository extends JpaRepository<Physician, Long> {

  Optional<Physician> findByEmail(String email);

  List<Physician> findAllBySpecialty(Specialty specialty);
}
