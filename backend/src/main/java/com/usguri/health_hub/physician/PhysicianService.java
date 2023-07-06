package com.usguri.health_hub.physician;

import com.usguri.health_hub.appointment.AppointmentRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PhysicianService {
  private final PhysicianRepository physicianRepository;
  private final AppointmentRepository appointmentRepository;

  public List<Physician> getPhysicians(Optional<Specialty> specialty) {
    if (specialty.isPresent()) {
      return physicianRepository.findAllBySpecialty(specialty.get());
    } else {
      return physicianRepository.findAll();
    }
  }

  private Physician findPhysicianById(Long id) {
    return this.physicianRepository
        .findById(id)
        .orElseThrow(
            () -> new EntityNotFoundException("Physician with 'id':" + id + " not found."));
  }

  public void addNewPhysician(Physician physician) {

    Optional<Physician> physicianOptional = physicianRepository.findByEmail(physician.getEmail());
    if (physicianOptional.isPresent()) {
      throw new IllegalStateException("email taken");
    }
    physicianRepository.save(physician);
  }

  @Transactional
  public void deletePhysician(Long physicianId) {
    boolean exists = physicianRepository.existsById(physicianId);
    if (!exists) {
      throw new IllegalStateException("physician with id " + physicianId + " does not exist");
    }
    appointmentRepository.deleteAllByPhysicianId(physicianId);
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
