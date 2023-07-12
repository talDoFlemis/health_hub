package com.usguri.health_hub.physician;

import com.usguri.health_hub.appointment.AppointmentRepository;
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
 * Classe responsável por fornecer serviços relacionados aos médicos. @Author: Bruno Aguiar
 * (Bacs) @Version: 1.0 @Since: 2023-07-01
 */
@Service
@RequiredArgsConstructor
public class PhysicianService {
  private final PhysicianRepository physicianRepository;
  private final AppointmentRepository appointmentRepository;

  /**
   * Retorna uma lista de médicos com base em uma especialidade opcional e/ou nome opcional.
   *
   * @param specialty (opcional) - Especialidade médica.
   * @param name (opcional) - Nome do médico.
   * @return Lista de médicos encontrados.
   */
  public List<Physician> getPhysicians(Optional<Specialty> specialty, Optional<String> name) {
    Physician phy =
        Physician.builder().specialty(specialty.orElse(null)).name(name.orElse(null)).build();
    Example<Physician> probe =
        Example.of(
            phy,
            ExampleMatcher.matchingAll()
                .withIgnoreCase()
                .withStringMatcher(ExampleMatcher.StringMatcher.STARTING)
                .withIgnoreNullValues());
    return this.physicianRepository.findAll(probe);
  }

  /**
   * Retorna um médico com base no ID fornecido.
   *
   * @param id ID do médico.
   * @return O médico encontrado.
   * @throws EntityNotFoundException se o médico com o ID fornecido não for encontrado.
   */
  private Physician findPhysicianById(Long id) {
    return this.physicianRepository
        .findById(id)
        .orElseThrow(
            () -> new EntityNotFoundException("Physician with 'id':" + id + " not found."));
  }

  /**
   * Adiciona um novo médico.
   *
   * @param physician Dados do médico a ser adicionado.
   * @return O médico adicionado.
   * @throws IllegalStateException se o e-mail do médico já estiver em uso.
   */
  public Physician addNewPhysician(Physician physician) {

    Optional<Physician> physicianOptional = physicianRepository.findByEmail(physician.getEmail());
    if (physicianOptional.isPresent()) {
      throw new IllegalStateException("email taken");
    }
    return physicianRepository.save(physician);
  }

  /**
   * Exclui um médico com base no ID fornecido.
   *
   * @param physicianId ID do médico a ser excluído.
   * @throws IllegalStateException se o médico com o ID fornecido não existir.
   */
  @Transactional
  public void deletePhysician(Long physicianId) {
    boolean exists = physicianRepository.existsById(physicianId);
    if (!exists) {
      throw new IllegalStateException("physician with id " + physicianId + " does not exist");
    }
    appointmentRepository.deleteAllByPhysicianId(physicianId);
    physicianRepository.deleteById(physicianId);
  }

  /**
   * Atualiza os dados de um médico com base no ID fornecido.
   *
   * @param dto Dados atualizados do médico.
   * @param physicianId ID do médico a ser atualizado.
   * @return O médico atualizado.
   * @throws EntityExistsException se o e-mail atualizado do médico já estiver em uso.
   */
  @Transactional
  public Physician updatePhysician(UpdatePhysicianDTO dto, Long physicianId) {
    Physician original = findPhysicianById(physicianId);

    if (dto.getName() != null) {
      original.setName(dto.getName());
    }
    if (dto.getEmail() != null) {
      original.setEmail(dto.getEmail());
    }
    if (dto.getSpecialty() != null) {
      original.setSpecialty(dto.getSpecialty());
    }

    try {
      return this.physicianRepository.save(original);
    } catch (Exception e) {
      throw new EntityExistsException(
          "Physician with email: " + dto.getEmail() + " already exists");
    }
  }
}
