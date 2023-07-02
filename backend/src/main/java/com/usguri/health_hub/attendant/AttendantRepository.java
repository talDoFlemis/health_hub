package com.usguri.health_hub.attendant;

import java.util.Optional;
import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface AttendantRepository extends CrudRepository<Attendant, Long> {
    Optional<Attendant> findById(long id);
    List<Attendant> findAll();
    Attendant save();
    void deleteById(long id);
}
