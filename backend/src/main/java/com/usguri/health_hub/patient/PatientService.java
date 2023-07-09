package com.usguri.health_hub.patient;

import com.usguri.health_hub.appointment.Appointment;
import com.usguri.health_hub.appointment.AppointmentRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Serviço responsável por realizar operações relacionadas aos pacientes.
 *
 * @author Said Rodrigues
 * @version 1.0
 * @since 2023-07-01
 */
@Service
@RequiredArgsConstructor
public class PatientService {

  private final PatientRepository patientRepository;
  private final AppointmentRepository appointmentRepository;

  /**
   * Obtém a lista de todos os pacientes.
   *
   * @return A lista de todos os pacientes.
   */
  public List<Patient> getAll() {
    return this.patientRepository.findAll();
  }

  /**
   * Localiza um paciente pelo seu ID.
   *
   * @param id O ID do paciente.
   * @return Os dados do paciente encontrado.
   * @throws EntityNotFoundException Se o paciente não for encontrado.
   */
  private Patient findUserById(Long id) {
    return this.patientRepository
        .findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Patient with 'id': " + id + " not found."));
  }

  /**
   * Obtém os dados de um paciente pelo seu ID.
   *
   * @param id O ID do paciente.
   * @return Os dados do paciente encontrado.
   * @throws EntityNotFoundException Se o paciente não for encontrado.
   */
  public Patient findById(Long id) {
    return findUserById(id);
  }

  /**
   * Obtém os dados de um paciente pelo seu email.
   *
   * @param email O email do paciente.
   * @return Os dados do paciente encontrado.
   * @throws EntityNotFoundException Se o paciente não for encontrado.
   */
  public Patient findByEmail(String email) {
    return this.patientRepository
        .findByEmail(email)
        .orElseThrow(
            () -> new EntityNotFoundException("Patient with 'email': " + email + " not found."));
  }

  /**
   * Cria um novo paciente.
   *
   * @param dto Os dados do paciente a ser registrado.
   * @return O paciente registrado.
   * @throws EntityExistsException Se já existir um paciente com o mesmo email.
   */
  public Patient createPatient(CreatePatientDTO dto) {
    Patient pat =
        Patient.builder()
            .firstname(dto.getFirstname())
            .lastname(dto.getLastname())
            .email(dto.getEmail())
            .dbo(dto.getDbo())
            .build();
    try {
      return this.patientRepository.save(pat);
    } catch (Exception e) {
      throw new EntityExistsException("Patient with email: " + dto.getEmail() + " already exists.");
    }
  }

  /**
   * Remove um paciente pelo seu ID.
   *
   * @param id O ID do paciente a ser removido.
   */
  @Transactional
  public void removePatient(Long id) {
    Patient pat = findUserById(id);
    this.appointmentRepository.deleteAllByPatientId(id);
    this.patientRepository.deleteById(pat.getId());
  }

  /**
   * Atualiza os dados de um paciente pelo seu ID.
   *
   * @param dto Os dados atualizados do paciente.
   * @param id O ID do paciente a ser atualizado.
   * @return Os dados do paciente atualizado.
   * @throws EntityExistsException Se já existir um paciente com o mesmo email.
   */
  @Transactional
  public Patient updatePatient(UpdatePatientDTO dto, Long id) {
    Patient original = findUserById(id);
    if (dto.getFirstname() != null) {
      original.setFirstname(dto.getFirstname());
    }
    if (dto.getLastname() != null) {
      original.setLastname(dto.getLastname());
    }
    if (dto.getDbo() != null) {
      original.setDbo(dto.getDbo());
    }
    if (dto.getEmail() != null) {
      original.setEmail(dto.getEmail());
    }

    try {
      return this.patientRepository.save(original);
    } catch (Exception e) {
      throw new EntityExistsException("Patient with email: " + dto.getEmail() + " already exists.");
    }
  }

  /**
   * Obtém a lista de consultas de um paciente pelo seu email.
   *
   * @param email O email do paciente.
   * @return A lista de consultas do paciente.
   * @throws EntityNotFoundException Se o paciente não for encontrado.
   */
  @Transactional
  public List<Appointment> findAppointmentsByEmail(String email) {
    Patient pat =
        this.patientRepository
            .findByEmail(email)
            .orElseThrow(
                () -> new EntityNotFoundException("Patient with email: " + email + " not found."));
    return this.appointmentRepository.findAllByPatientIdOrderByTimeAsc(pat.getId());
  }
}
