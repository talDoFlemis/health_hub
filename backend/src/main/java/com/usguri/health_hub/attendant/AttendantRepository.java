package com.usguri.health_hub.attendant;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Example;
import org.springframework.data.repository.CrudRepository;
import org.springframework.lang.NonNull;

public interface AttendantRepository extends CrudRepository<Attendant, Long> {
  Optional<Attendant> findById(long id);

  @NotNull
  List<Attendant> findAll();

  @NonNull
  List<Attendant> findAll(Example<Attendant> sample);

  void deleteById(long id);

  Optional<Attendant> findByEmail(String email);
}
