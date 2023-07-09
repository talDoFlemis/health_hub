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

/**
 * Serviço responsável por realizar operações relacionadas às consultas médicas.
 *
 * @author Said Rodrigues
 * @version 1.0
 * @since 2023-07-03
 */
@Service
@RequiredArgsConstructor
public class AppointmentService {

  private final AppointmentRepository appointmentRepository;
  private final PatientRepository patientRepository;
  private final PhysicianRepository physicianRepository;

  /**
   * Localiza uma consulta médica pelo seu ID.
   *
   * @param id O ID da consulta médica.
   * @return Os dados da consulta médica encontrada.
   * @throws EntityNotFoundException Se a consulta médica não for encontrada.
   */
  private Appointment findAppointmentById(Long id) {
    return this.appointmentRepository
        .findById(id)
        .orElseThrow(
            () -> new EntityNotFoundException("Appointment with 'id': " + id + " not found."));
  }

  /**
   * Obtém a lista de todas as consultas médicas.
   *
   * @return A lista de todas as consultas médicas.
   */
  public List<Appointment> getAll() {
    return this.appointmentRepository.findAll();
  }

  /**
   * Obtém a lista de todas as consultas médicas dentro de um determinado período.
   *
   * @param dto O objeto que contém as datas de início e fim do período.
   * @return A lista de todas as consultas médicas dentro do período especificado.
   */
  public List<Appointment> getAllBetween(BetweenDatesDTO dto) {
    return this.appointmentRepository.findAllByTimeBetweenOrderByTimeAsc(
        dto.getStart(), dto.getEnd());
  }

  /**
   * Obtém a lista de todas as consultas médicas de um paciente específico.
   *
   * @param id O ID do paciente.
   * @return A lista de todas as consultas médicas do paciente.
   */
  public List<Appointment> getAllByPatient(Long id) {
    return this.appointmentRepository.findAllByPatientIdOrderByTimeAsc(id);
  }

  /**
   * Obtém a lista de todas as consultas médicas de um médico específico.
   *
   * @param id O ID do médico.
   * @return A lista de todas as consultas médicas do médico.
   */
  public List<Appointment> getAllByPhysician(Long id) {
    return this.appointmentRepository.findAllByPhysicianIdOrderByTimeAsc(id);
  }

  /**
   * Cria uma nova consulta médica.
   *
   * @param app Os dados da consulta médica a ser criada.
   * @return A consulta médica criada.
   * @throws EntityNotFoundException Se o paciente ou médico associado à consulta médica não forem
   *     encontrados.
   */
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

  /**
   * Atualiza os dados de uma consulta médica existente.
   *
   * @param app Os dados atualizados da consulta médica.
   * @param id O ID da consulta médica a ser atualizada.
   * @return Os dados da consulta médica atualizada.
   * @throws EntityNotFoundException Se a consulta médica não for encontrada.
   */
  @Transactional
  public Appointment updateAppointment(UpdateAppointmentDTO app, Long id) {
    Appointment appointment = findAppointmentById(id);
    appointment.setTime(app.getTime());
    if (app.getAnnotations() != null) {
      appointment.setAnnotations(app.getAnnotations());
    }
    return this.appointmentRepository.save(appointment);
  }

  /**
   * Exclui uma consulta médica pelo seu ID.
   *
   * @param id O ID da consulta médica a ser excluída.
   * @throws EntityNotFoundException Se a consulta médica não for encontrada.
   */
  @Transactional
  public void deleteAppointment(Long id) {
    Appointment appointment = findAppointmentById(id);
    this.appointmentRepository.deleteById(appointment.getId());
  }

  /**
   * Obtém a lista de todas as consultas médicas de um paciente específico dentro de um determinado
   * período.
   *
   * @param dates O objeto que contém as datas de início e fim do período.
   * @param id O ID do paciente.
   * @return A lista de todas as consultas médicas do paciente dentro do período especificado.
   */
  public List<Appointment> getAllByPatientBetween(BetweenDatesDTO dates, Long id) {
    return this.appointmentRepository.findAllByPatientIdAndTimeBetweenOrderByTimeAsc(
        id, dates.getStart(), dates.getEnd());
  }

  /**
   * Obtém a lista de todas as consultas médicas de um médico específico dentro de um determinado
   * período.
   *
   * @param dates O objeto que contém as datas de início e fim do período.
   * @param id O ID do médico.
   * @return A lista de todas as consultas médicas do médico dentro do período especificado.
   */
  public List<Appointment> getAllByPhysicianBetween(BetweenDatesDTO dates, Long id) {
    return this.appointmentRepository.findAllByPhysicianIdAndTimeBetweenOrderByTimeAsc(
        id, dates.getStart(), dates.getEnd());
  }
}
