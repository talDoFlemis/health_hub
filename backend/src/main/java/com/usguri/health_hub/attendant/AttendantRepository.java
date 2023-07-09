package com.usguri.health_hub.attendant;

import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface AttendantRepository extends CrudRepository<Attendant, Long> {
  Optional<Attendant> findById(long id);

  List<Attendant> findAll();

  Attendant save();

  void deleteById(long id);

  Optional<Attendant> findByEmail(String email);
}
