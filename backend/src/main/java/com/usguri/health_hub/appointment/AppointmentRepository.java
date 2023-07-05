package com.usguri.health_hub.appointment;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
  List<Appointment> findAllByPatientIdOrderByTimeAsc(Long patient_id);

  List<Appointment> findAllByPhysicianIdOrderByTimeAsc(Long physician_id);

  List<Appointment> findAllByPatientIdAndTimeBetweenOrderByTimeAsc(
      Long patient_id, LocalDateTime start, LocalDateTime end);

  List<Appointment> findAllByPhysicianIdAndTimeBetweenOrderByTimeAsc(
      Long id, LocalDateTime start, LocalDateTime end);

  List<Appointment> findAllByTimeBetweenOrderByTimeAsc(LocalDateTime start, LocalDateTime end);

    void deleteAllByPatientId(Long id);
}
