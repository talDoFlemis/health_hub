package com.usguri.health_hub.patient;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientService {
  private final PatientRepository patientRepository;

  public List<Patient> getAll() {
    return this.patientRepository.findAll();
  }

  private Patient findUserById(Long id) {
    return this.patientRepository
        .findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Patient with 'id':" + id + " not found."));
  }

  public Patient findById(Long id) {
    return findUserById(id);
  }

  public Patient findByEmail(String email) {
    return this.patientRepository
        .findByEmail(email)
        .orElseThrow(
            () -> new EntityNotFoundException("Patient with 'email': " + email + " not found"));
  }

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
      throw new EntityExistsException("Patient with email: " + dto.getEmail() + " already exists");
    }
  }

  @Transactional
  public void removePatient(Long id) {
    Patient pat = findUserById(id);
    this.patientRepository.deleteById(pat.getId());
  }

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
      throw new EntityExistsException("Patient with email: " + dto.getEmail() + " already exists");
    }
  }
}
