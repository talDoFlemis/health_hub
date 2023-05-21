package com.usguri.health_hub.patient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {
    private final PatientRepository patientRepository;

    @Autowired
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<Patient> getAll() {
        return this.patientRepository.findAll();

    }

    public Optional<Patient> findById(Long id) {
        return this.patientRepository.findById(id);
    }

    public Optional<Patient> findByEmail(String email) {
        return this.patientRepository.findByEmail(email);
    }

    public Patient createPatient(Patient patDTO) {
        Optional<Patient> pat = this.findByEmail(patDTO.getEmail());
        if(pat.isPresent()){
            throw new IllegalStateException("email taken");
        }else {
            return this.patientRepository.save(patDTO);
        }
    }
}
