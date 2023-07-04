package com.usguri.health_hub.appointment;

import com.usguri.health_hub.patient.Patient;
import com.usguri.health_hub.patient.PatientRepository;
import com.usguri.health_hub.physician.Physician;
import com.usguri.health_hub.physician.PhysicianRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppointmentService {
  private final AppointmentRepository appointmentRepository;
  private final PatientRepository patientRepository;
  private final PhysicianRepository physicianRepository;

  private Appointment findAppointmentById(Long id) {
    return this.appointmentRepository
        .findById(id)
        .orElseThrow(
            () -> new EntityNotFoundException("Appointment with 'id':" + id + " not found."));
  }

  public List<Appointment> getAll() {
    return this.appointmentRepository.findAll();
  }

  public List<Appointment> getAllBetween(BetweenDatesDTO dto) {
    return this.appointmentRepository.findAllByTimeBetweenOrderByTimeAsc(
        dto.getStart(), dto.getEnd());
  }

  public List<Appointment> getAllByPatient(Long id) {
    return this.appointmentRepository.findAllByPatientIdOrderByTimeAsc(id);
  }

  public List<Appointment> getAllByPhysician(Long id) {
    return this.appointmentRepository.findAllByPhysicianIdOrderByTimeAsc(id);
  }

  @Transactional
  public Appointment createAppointment(CreateAppointmentDTO app) {
    Patient patient =
        patientRepository
            .findById(app.getPatient_id())
            .orElseThrow(
                () ->
                    new EntityNotFoundException(
                        "Patient with id " + app.getPatient_id() + " not found."));
    Physician physician =
        physicianRepository
            .findById(app.getPhysician_id())
            .orElseThrow(
                () ->
                    new EntityNotFoundException(
                        "Physician with id " + app.getPhysician_id() + " not found."));
    Appointment appointment =
        Appointment.builder()
            .patient(patient)
            .physician(physician)
            .time(app.getTime())
            .physicianId(app.getPhysician_id())
            .patientId(app.getPatient_id())
            .annotations(app.getAnnotations())
            .build();
    return this.appointmentRepository.save(appointment);
  }

  @Transactional
  public Appointment updateAppointment(UpdateAppointmentDTO app, Long id) {
    Appointment appointment = findAppointmentById(id);
    appointment.setTime(app.getTime());
    if (app.getAnnotations() != null) {
      appointment.setAnnotations(app.getAnnotations());
    }
    return this.appointmentRepository.save(appointment);
  }

  @Transactional
  public void deleteAppointment(Long id) {
    Appointment appointment = findAppointmentById(id);
    this.appointmentRepository.deleteById(appointment.getId());
  }

  public List<Appointment> getAllByPatientBetween(BetweenDatesDTO dates, Long id) {
    return this.appointmentRepository.findAllByPatientIdAndTimeBetweenOrderByTimeAsc(
        id, dates.getStart(), dates.getEnd());
  }

  public List<Appointment> getAllByPhysicianBetween(BetweenDatesDTO dates, Long id) {
    return this.appointmentRepository.findAllByPhysicianIdAndTimeBetweenOrderByTimeAsc(
        id, dates.getStart(), dates.getEnd());
  }
}
