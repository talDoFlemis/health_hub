package com.usguri.health_hub.attendant;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "${apiPrefix}/attendant")
@RequiredArgsConstructor
public class AttendantController {
  private final AttendantService attendantService;

  @GetMapping("/me")
  public Attendant getMyData(Authentication auth) {
    return this.attendantService.findByEmail(auth.getName());
  }

  @GetMapping("/all")
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public List<Attendant> getAllAttendants() {
    return this.attendantService.getAll();
  }

  @GetMapping("/{id}")
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public Attendant getAttendantById(@PathVariable Long id) {
    return this.attendantService.findById(id);
  }

  @PostMapping("/create")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public Attendant registerAttendant(@Valid @RequestBody CreateAttendantDTO pat) {
    return this.attendantService.createAttendant(pat);
  }

  @DeleteMapping("{id}")
  @ResponseStatus(HttpStatus.OK)
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public void removeAttendant(@PathVariable Long id) {
    this.attendantService.removeAttendant(id);
  }

  @PatchMapping("/update/{id}")
  @ResponseStatus(HttpStatus.OK)
  @PreAuthorize(value = "hasAnyRole('ADMIN')")
  public Attendant updateAttendant(@Valid @RequestBody UpdateAttendantDTO pat, @PathVariable Long id) {
    return this.attendantService.updateAttendant(pat, id);
  }
}
