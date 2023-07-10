package com.usguri.health_hub.attendant;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

/**
 * Serviço responsável por realizar operações relacionadas aos atendentes.
 *
 * @author André Willyan
 * @version 1.0
 * @since 2023-07-02
 */
@Service
@RequiredArgsConstructor
public class AttendantService {

  private final AttendantRepository attendantRepository;

  /**
   * Obtém a lista de todos os atendentes.
   *
   * @param name (Opcional) O nome do atendente para filtrar a busca.
   * @param email (Opcional) O email do atendente para filtrar a busca.
   * @return A lista de todos os atendentes que correspondem aos critérios de busca.
   */
  public List<Attendant> getAll(Optional<String> name, Optional<String> email) {
    Attendant attendant =
        Attendant.builder().firstname(name.orElse(null)).email(email.orElse(null)).build();
    Example<Attendant> probe =
        Example.of(
            attendant,
            ExampleMatcher.matchingAll()
                .withIgnoreCase()
                .withStringMatcher(ExampleMatcher.StringMatcher.STARTING)
                .withIgnoreNullValues());

    return this.attendantRepository.findAll(probe);
  }

  /**
   * Localiza um atendente pelo seu ID.
   *
   * @param id O ID do atendente.
   * @return Os dados do atendente encontrado.
   * @throws EntityNotFoundException Se o atendente não for encontrado.
   */
  private Attendant findUserById(Long id) {
    return this.attendantRepository
        .findById(id)
        .orElseThrow(
            () -> new EntityNotFoundException("Attendant with 'id': " + id + " not found."));
  }

  /**
   * Obtém os dados de um atendente pelo seu ID.
   *
   * @param id O ID do atendente.
   * @return Os dados do atendente encontrado.
   * @throws EntityNotFoundException Se o atendente não for encontrado.
   */
  public Attendant findById(Long id) {
    return findUserById(id);
  }

  /**
   * Obtém os dados de um atendente pelo seu email.
   *
   * @param email O email do atendente.
   * @return Os dados do atendente encontrado.
   * @throws EntityNotFoundException Se o atendente não for encontrado.
   */
  public Attendant findByEmail(String email) {
    return this.attendantRepository
        .findByEmail(email)
        .orElseThrow(
            () -> new EntityNotFoundException("Attendant with 'email': " + email + " not found."));
  }

  /**
   * Cria um novo atendente.
   *
   * @param dto Os dados do atendente a ser registrado.
   * @return O atendente registrado.
   * @throws EntityExistsException Se já existir um atendente com o mesmo email.
   */
  public Attendant createAttendant(CreateAttendantDTO dto) {
    Attendant pat =
        Attendant.builder()
            .firstname(dto.getFirstname())
            .lastname(dto.getLastname())
            .email(dto.getEmail())
            .dbo(dto.getDbo())
            .build();
    try {
      return this.attendantRepository.save(pat);
    } catch (Exception e) {
      throw new EntityExistsException(
          "Attendant with email: " + dto.getEmail() + " already exists.");
    }
  }

  /**
   * Remove um atendente pelo seu ID.
   *
   * @param id O ID do atendente a ser removido.
   */
  @Transactional
  public void removeAttendant(Long id) {
    Attendant pat = findUserById(id);
    this.attendantRepository.deleteById(pat.getId());
  }

  /**
   * Atualiza os dados de um atendente pelo seu ID.
   *
   * @param dto Os dados atualizados do atendente.
   * @param id O ID do atendente a ser atualizado.
   * @return Os dados do atendente atualizado.
   * @throws EntityExistsException Se já existir um atendente com o mesmo email.
   */
  @Transactional
  public Attendant updateAttendant(UpdateAttendantDTO dto, Long id) {
    Attendant original = findUserById(id);
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
      return this.attendantRepository.save(original);
    } catch (Exception e) {
      throw new EntityExistsException(
          "Attendant with email: " + dto.getEmail() + " already exists.");
    }
  }
}
