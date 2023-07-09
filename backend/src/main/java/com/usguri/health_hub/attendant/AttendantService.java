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

@Service
@RequiredArgsConstructor
public class AttendantService {
  private final AttendantRepository attendantRepository;

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

  private Attendant findUserById(Long id) {
    return this.attendantRepository
        .findById(id)
        .orElseThrow(
            () -> new EntityNotFoundException("Attendant with 'id':" + id + " not found."));
  }

  public Attendant findById(Long id) {
    return findUserById(id);
  }

  public Attendant findByEmail(String email) {
    return this.attendantRepository
        .findByEmail(email)
        .orElseThrow(
            () -> new EntityNotFoundException("Attendant with 'email': " + email + " not found"));
  }

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
          "Attendant with email: " + dto.getEmail() + " already exists");
    }
  }

  @Transactional
  public void removeAttendant(Long id) {
    Attendant pat = findUserById(id);
    this.attendantRepository.deleteById(pat.getId());
  }

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
          "Attendant with email: " + dto.getEmail() + " already exists");
    }
  }
}
