package com.usguri.health_hub.physician;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador responsável por lidar com as operações relacionadas aos médicos.
 *
 * @author Bruno Aguiar (Bacs)
 * @version 1.0
 * @since 2023-07-01
 */
@RestController
@RequestMapping(path = "${apiPrefix}/physician")
@RequiredArgsConstructor
public class PhysicianController {
  private final PhysicianService physicianService;

  /**
   * Retorna a lista de médicos com base em parâmetros opcionais.
   *
   * @param specialty (opcional) - Especialidade médica.
   * @param name (opcional) - Nome do médico.
   * @return Lista de médicos encontrados.
   */
  @GetMapping
  @PreAuthorize(value = "hasAnyRole('ADMIN', 'ATTENDANT')")
  public List<Physician> getPhysicians(
      @RequestParam Optional<Specialty> specialty, @RequestParam Optional<String> name) {
    return physicianService.getPhysicians(specialty, name);
  }

  /**
   * Registra um novo médico.
   *
   * @param physician Dados do médico a ser registrado.
   * @return O médico registrado.
   */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public Physician registerNewPhysician(@RequestBody Physician physician) {
    return physicianService.addNewPhysician(physician);
  }

  /**
   * Exclui um médico com base no ID fornecido.
   *
   * @param physicianId ID do médico a ser excluído.
   */
  @DeleteMapping(path = "{physicianId}")
  @ResponseStatus(HttpStatus.OK)
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public void deletePhysician(@PathVariable("physicianId") Long physicianId) {
    physicianService.deletePhysician(physicianId);
  }

  /**
   * Atualiza os dados de um médico com base no ID fornecido.
   *
   * @param pat Dados atualizados do médico.
   * @param physicianId ID do médico a ser atualizado.
   * @return O médico atualizado.
   */
  @PatchMapping(path = "{physicianId}")
  @ResponseStatus(HttpStatus.OK)
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public Physician updatePhysician(
      @Valid @RequestBody UpdatePhysicianDTO pat, @PathVariable Long physicianId) {
    return this.physicianService.updatePhysician(pat, physicianId);
  }
}
