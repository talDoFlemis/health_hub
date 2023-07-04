package com.usguri.health_hub.physician;

import jakarta.validation.Valid;
import java.util.List;
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
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public List<Physician> getPhysicians() {
    return physicianService.getPhysicians();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public void registerNewPhysician(@RequestBody Physician physician) {
    physicianService.addNewPhysician(physician);
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
