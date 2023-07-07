package com.usguri.health_hub.appointment;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class UpdateAppointmentDTO {
  @NotNull @Future private LocalDateTime time;

  private String annotations;
}
