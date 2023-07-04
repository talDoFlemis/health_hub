package com.usguri.health_hub.physician;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PhysicianService {
  private final PhysicianRepository physicianRepository;

  @Autowired
  public PhysicianService(PhysicianRepository physicianRepository) {
    this.physicianRepository = physicianRepository;
  }

  public List<Physician> getPhysicians() {
    return physicianRepository.findAll();
  }

  private Physician findPhysicianById(Long id) {
    return this.physicianRepository
        .findById(id)
        .orElseThrow(
            () -> new EntityNotFoundException("Physician with 'id':" + id + " not found."));
  }

  public void addNewPhysician(Physician physician) {

    Optional<Physician> physicianOptional =
        physicianRepository.findPhysicianByEmail(physician.getEmail());
    if (physicianOptional.isPresent()) {
      throw new IllegalStateException("email taken");
    }
    physicianRepository.save(physician);
  }

  public void deletePhysician(Long physicianId) {
    boolean exists = physicianRepository.existsById(physicianId);
    if (!exists) {
      throw new IllegalStateException("physician with id " + physicianId + " does not exist");
    }
    physicianRepository.deleteById(physicianId);
  }

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
