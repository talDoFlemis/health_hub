package com.usguri.health_hub.patient;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "${apiPrefix}/patient")
@RequiredArgsConstructor
public class PatientController {
  private final PatientService patientService;

  @GetMapping("/me")
  public Patient getMyData(Authentication auth) {
    return this.patientService.findByEmail(auth.getName());
  }

  @GetMapping("/all")
  @PreAuthorize(value = "hasAnyRole('ADMIN', 'ATTENDANT')")
  public List<Patient> getAllPatients() {
    return this.patientService.getAll();
  }

  @GetMapping("/{id}")
  @PreAuthorize(value = "hasAnyRole('ADMIN', 'ATTENDANT')")
  public Patient getPatientById(@PathVariable Long id) {
    return this.patientService.findById(id);
  }

  @PostMapping("/create")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize(value = "hasAnyRole('ADMIN', 'ATTENDANT')")
  public Patient registerPatient(@Valid @RequestBody CreatePatientDTO pat) {
    return this.patientService.createPatient(pat);
  }

  @DeleteMapping("{id}")
  @ResponseStatus(HttpStatus.OK)
  @PreAuthorize(value = "hasAnyRole('ADMIN', 'ATTENDANT')")
  public void removePatient(@PathVariable Long id) {
    this.patientService.removePatient(id);
  }

  @PatchMapping("/update/{id}")
  @ResponseStatus(HttpStatus.OK)
  @PreAuthorize(value = "hasAnyRole('ADMIN', 'ATTENDANT')")
  public Patient updatePatient(@Valid @RequestBody UpdatePatientDTO pat, @PathVariable Long id) {
    return this.patientService.updatePatient(pat, id);
  }
}
