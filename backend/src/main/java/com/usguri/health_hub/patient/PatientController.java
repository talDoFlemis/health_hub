package com.usguri.health_hub.patient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/patient")
public class PatientController {
    private final PatientService patientService;

    @Autowired
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public List<Patient> getPatients() {
        return this.patientService.getAll();
    }

    @GetMapping("/{id}")
    public Patient getPatientById(@PathVariable Long id) {
        Optional<Patient> pat = this.patientService.findById(id);
        if (pat.isPresent()) {
            return pat.get();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "patient with id: " + id + " was not found");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Patient registerPatient(@RequestBody Patient pat) {
        try {
            return this.patientService.createPatient(pat);
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "email " + pat.getEmail() + " taken");
        }
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    public void removePatient(@PathVariable Long id) {
        try {
            this.patientService.removePatient(id);
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

    }

    @PatchMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    public Patient updatePatient(@RequestBody Patient pat) {
        try {
            return this.patientService.updatePatient(pat);
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

    }
}
