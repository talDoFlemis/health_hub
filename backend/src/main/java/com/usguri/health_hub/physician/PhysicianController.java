package com.usguri.health_hub.physician;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "${apiPrefix}/physician")
@RequiredArgsConstructor
public class PhysicianController {
  private final PhysicianService physicianService;

  @GetMapping
  @PreAuthorize(value = "hasAnyRole('ADMIN', 'ATTENDANT')")
  public List<Physician> getPhysicians(
      @RequestParam Optional<Specialty> specialty, @RequestParam Optional<String> name) {
    return physicianService.getPhysicians(specialty, name);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public Physician registerNewPhysician(@RequestBody Physician physician) {
    return physicianService.addNewPhysician(physician);
  }

  @DeleteMapping(path = "{physicianId}")
  @ResponseStatus(HttpStatus.OK)
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public void deletePhysician(@PathVariable("physicianId") Long physicianId) {
    physicianService.deletePhysician(physicianId);
  }

  @PatchMapping(path = "{physicianId}")
  @ResponseStatus(HttpStatus.OK)
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public Physician updatePhysician(
      @Valid @RequestBody UpdatePhysicianDTO pat, @PathVariable Long physicianId) {
    return this.physicianService.updatePhysician(pat, physicianId);
  }
}
