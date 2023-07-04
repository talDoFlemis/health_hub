package com.usguri.health_hub.appointment;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "${apiPrefix}/appointment")
@RequiredArgsConstructor
public class AppointmentController {
  private final AppointmentService appointmentService;

  @GetMapping("/all")
  public List<Appointment> getAll() {
    return this.appointmentService.getAll();
  }

  @GetMapping("/between")
  public List<Appointment> getAllBetween(@Valid @RequestBody BetweenDatesDTO dates) {
    return this.appointmentService.getAllBetween(dates);
  }

  @GetMapping("/patient/{id}")
  public List<Appointment> getAllByPatient(@PathVariable Long id) {
    return this.appointmentService.getAllByPatient(id);
  }

  @GetMapping("/patient/between/{id}")
  public List<Appointment> getAllByPatientBetween(
      @Valid @RequestBody BetweenDatesDTO dates, @PathVariable Long id) {
    return this.appointmentService.getAllByPatientBetween(dates, id);
  }

  @GetMapping("/physician/{id}")
  public List<Appointment> getAllByPhysician(@PathVariable Long id) {
    return this.appointmentService.getAllByPhysician(id);
  }

  @GetMapping("/physician/between/{id}")
  public List<Appointment> getAllByPhysicianBetween(
      @Valid @RequestBody BetweenDatesDTO dates, @PathVariable Long id) {
    return this.appointmentService.getAllByPhysicianBetween(dates, id);
  }

  @PostMapping("/create")
  @ResponseStatus(HttpStatus.CREATED)
  public Appointment create(@Valid @RequestBody CreateAppointmentDTO app) {
    return this.appointmentService.createAppointment(app);
  }

  @PatchMapping("/update/{id}")
  @ResponseStatus(HttpStatus.OK)
  public Appointment update(@Valid @RequestBody UpdateAppointmentDTO app, @PathVariable Long id) {
    return this.appointmentService.updateAppointment(app, id);
  }

  @DeleteMapping("/delete/{id}")
  @ResponseStatus(HttpStatus.OK)
  public void delete(@PathVariable Long id) {
    this.appointmentService.deleteAppointment(id);
  }
}
