package com.usguri.health_hub.patient;

import com.usguri.health_hub.appointment.Appointment;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador responsável por lidar com as operações relacionadas aos pacientes.
 *
 * @author Said Rodrigues
 * @version 1.0
 * @since 2023-07-01
 */
@RestController
@RequestMapping(path = "${apiPrefix}/patient")
@RequiredArgsConstructor
public class PatientController {

  private final PatientService patientService;

  /**
   * Obtém os dados do paciente autenticado.
   *
   * @param auth A autenticação do paciente.
   * @return Os dados do paciente autenticado.
   */
  @GetMapping("/me")
  public Patient getMyData(Authentication auth) {
    return this.patientService.findByEmail(auth.getName());
  }

  /**
   * Obtém a lista de consultas do paciente autenticado.
   *
   * @param auth A autenticação do paciente.
   * @return A lista de consultas do paciente autenticado.
   */
  @GetMapping("/me/appointments")
  public List<Appointment> getMyAppointments(Authentication auth) {
    return this.patientService.findAppointmentsByEmail(auth.getName());
  }

  /**
   * Obtém a lista de todos os pacientes (apenas para ADMIN ou ATTENDANT).
   *
   * @return A lista de todos os pacientes.
   */
  @GetMapping("/all")
  @PreAuthorize(value = "hasAnyRole('ADMIN', 'ATTENDANT')")
  public List<Patient> getAllPatients() {
    return this.patientService.getAll();
  }

  /**
   * Obtém os dados de um paciente pelo seu ID (apenas para ADMIN ou ATTENDANT).
   *
   * @param id O ID do paciente.
   * @return Os dados do paciente encontrado.
   */
  @GetMapping("/{id}")
  @PreAuthorize(value = "hasAnyRole('ADMIN', 'ATTENDANT')")
  public Patient getPatientById(@PathVariable Long id) {
    return this.patientService.findById(id);
  }

  /**
   * Registra um novo paciente (apenas para ADMIN ou ATTENDANT).
   *
   * @param pat Os dados do paciente a ser registrado.
   * @return O paciente registrado.
   */
  @PostMapping("/create")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize(value = "hasAnyRole('ADMIN', 'ATTENDANT')")
  public Patient registerPatient(@Valid @RequestBody CreatePatientDTO pat) {
    return this.patientService.createPatient(pat);
  }

  /**
   * Remove um paciente pelo seu ID (apenas para ADMIN ou ATTENDANT).
   *
   * @param id O ID do paciente a ser removido.
   */
  @DeleteMapping("{id}")
  @ResponseStatus(HttpStatus.OK)
  @PreAuthorize(value = "hasAnyRole('ADMIN', 'ATTENDANT')")
  public void removePatient(@PathVariable Long id) {
    this.patientService.removePatient(id);
  }

  /**
   * Atualiza os dados de um paciente pelo seu ID (apenas para ADMIN ou ATTENDANT).
   *
   * @param pat Os dados atualizados do paciente.
   * @param id O ID do paciente a ser atualizado.
   * @return Os dados do paciente atualizado.
   */
  @PatchMapping("/update/{id}")
  @ResponseStatus(HttpStatus.OK)
  @PreAuthorize(value = "hasAnyRole('ADMIN', 'ATTENDANT')")
  public Patient updatePatient(@Valid @RequestBody UpdatePatientDTO pat, @PathVariable Long id) {
    return this.patientService.updatePatient(pat, id);
  }
}
