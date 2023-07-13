package com.usguri.health_hub.appointment;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador responsável por lidar com as operações relacionadas a consultas médicas.
 *
 * @author Said Rodrigues
 * @version 1.0
 * @since 2023-07-03
 */
@RestController
@RequestMapping(path = "${apiPrefix}/appointment")
@RequiredArgsConstructor
public class AppointmentController {

  private final AppointmentService appointmentService;

  /**
   * Obtém a lista de todas as consultas médicas.
   *
   * @return A lista de todas as consultas médicas.
   */
  @GetMapping("/all")
  public List<Appointment> getAll() {
    return this.appointmentService.getAll();
  }

  /**
   * Obtém a lista de todas as consultas médicas dentro de um determinado período.
   *
   * @param start O objeto que contém as datas de início e fim do período.
   * @return A lista de todas as consultas médicas dentro do período especificado.
   */
  @GetMapping("/between")
  public List<Appointment> getAllBetween(
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
    return this.appointmentService.getAllBetween(start, end);
  }

  /**
   * Obtém a lista de todas as consultas médicas de um paciente específico.
   *
   * @param id O ID do paciente.
   * @return A lista de todas as consultas médicas do paciente.
   */
  @GetMapping("/patient/{id}")
  public List<Appointment> getAllByPatient(@PathVariable Long id) {
    return this.appointmentService.getAllByPatient(id);
  }

  /**
   * Obtém a lista de todas as consultas médicas de um paciente específico dentro de um determinado
   * período.
   *
   * @param start O objeto que contém as datas de início e fim do período.
   * @param id O ID do paciente.
   * @return A lista de todas as consultas médicas do paciente dentro do período especificado.
   */
  @GetMapping("/patient/between/{id}")
  public List<Appointment> getAllByPatientBetween(
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
      @PathVariable Long id) {
    return this.appointmentService.getAllByPatientBetween(start, end, id);
  }

  /**
   * Obtém a lista de todas as consultas médicas de um médico específico.
   *
   * @param id O ID do médico.
   * @return A lista de todas as consultas médicas do médico.
   */
  @GetMapping("/physician/{id}")
  public List<Appointment> getAllByPhysician(@PathVariable Long id) {
    return this.appointmentService.getAllByPhysician(id);
  }

  /**
   * Obtém a lista de todas as consultas médicas de um médico específico dentro de um determinado
   * período.
   *
   * @param start O objeto que contém as datas de início e fim do período.
   * @param id O ID do médico.
   * @return A lista de todas as consultas médicas do médico dentro do período especificado.
   */
  @GetMapping("/physician/between/{id}")
  public List<Appointment> getAllByPhysicianBetween(
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
      @PathVariable Long id) {
    return this.appointmentService.getAllByPhysicianBetween(start, end, id);
  }

  /**
   * Cria uma nova consulta médica.
   *
   * @param app Os dados da consulta médica a ser criada.
   * @return A consulta médica criada.
   */
  @PostMapping("/create")
  @ResponseStatus(HttpStatus.CREATED)
  public Appointment create(@Valid @RequestBody CreateAppointmentDTO app) {
    return this.appointmentService.createAppointment(app);
  }

  /**
   * Atualiza os dados de uma consulta médica existente.
   *
   * @param app Os dados atualizados da consulta médica.
   * @param id O ID da consulta médica a ser atualizada.
   * @return Os dados da consulta médica atualizada.
   */
  @PatchMapping("/update/{id}")
  @ResponseStatus(HttpStatus.OK)
  public Appointment update(@Valid @RequestBody UpdateAppointmentDTO app, @PathVariable Long id) {
    return this.appointmentService.updateAppointment(app, id);
  }

  /**
   * Exclui uma consulta médica pelo seu ID.
   *
   * @param id O ID da consulta médica a ser excluída.
   */
  @DeleteMapping("/delete/{id}")
  @ResponseStatus(HttpStatus.OK)
  public void delete(@PathVariable Long id) {
    this.appointmentService.deleteAppointment(id);
  }
}
