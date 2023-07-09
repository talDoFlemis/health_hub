package com.usguri.health_hub.attendant;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador responsável por lidar com as operações relacionadas aos atendentes.
 *
 * @author André Willyan
 * @version 1.0
 * @since 2023-07-02
 */
@RestController
@RequestMapping(path = "${apiPrefix}/attendant")
@RequiredArgsConstructor
public class AttendantController {

  private final AttendantService attendantService;

  /**
   * Obtém os dados do atendente autenticado.
   *
   * @param auth A autenticação do atendente.
   * @return Os dados do atendente autenticado.
   */
  @GetMapping("/me")
  public Attendant getMyData(Authentication auth) {
    return this.attendantService.findByEmail(auth.getName());
  }

  /**
   * Obtém a lista de todos os atendentes (apenas para ADMIN).
   *
   * @param name (Opcional) O nome do atendente para filtrar a busca.
   * @param email (Opcional) O email do atendente para filtrar a busca.
   * @return A lista de todos os atendentes.
   */
  @GetMapping("/all")
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public List<Attendant> getAllAttendants(
      @RequestParam Optional<String> name, @RequestParam Optional<String> email) {
    return this.attendantService.getAll(name, email);
  }

  /**
   * Obtém os dados de um atendente pelo seu ID (apenas para ADMIN).
   *
   * @param id O ID do atendente.
   * @return Os dados do atendente encontrado.
   */
  @GetMapping("/{id}")
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public Attendant getAttendantById(@PathVariable Long id) {
    return this.attendantService.findById(id);
  }

  /**
   * Registra um novo atendente (apenas para ADMIN).
   *
   * @param pat Os dados do atendente a ser registrado.
   * @return O atendente registrado.
   */
  @PostMapping("/create")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public Attendant registerAttendant(@Valid @RequestBody CreateAttendantDTO pat) {
    return this.attendantService.createAttendant(pat);
  }

  /**
   * Remove um atendente pelo seu ID (apenas para ADMIN).
   *
   * @param id O ID do atendente a ser removido.
   */
  @DeleteMapping("{id}")
  @ResponseStatus(HttpStatus.OK)
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public void removeAttendant(@PathVariable Long id) {
    this.attendantService.removeAttendant(id);
  }

  /**
   * Atualiza os dados de um atendente pelo seu ID (apenas para ADMIN).
   *
   * @param pat Os dados atualizados do atendente.
   * @param id O ID do atendente a ser atualizado.
   * @return Os dados do atendente atualizado.
   */
  @PatchMapping("/update/{id}")
  @ResponseStatus(HttpStatus.OK)
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public Attendant updateAttendant(
      @Valid @RequestBody UpdateAttendantDTO pat, @PathVariable Long id) {
    return this.attendantService.updateAttendant(pat, id);
  }
}
