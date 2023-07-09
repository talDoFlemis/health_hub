package com.usguri.health_hub.attendant;

import java.util.List;
import java.util.Optional;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.repository.CrudRepository;

public interface AttendantRepository extends CrudRepository<Attendant, Long> {
  Optional<Attendant> findById(long id);

  @NotNull List<Attendant> findAll();

  void deleteById(long id);

  Optional<Attendant> findByEmail(String email);
}
