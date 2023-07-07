package com.usguri.health_hub.appointment;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class CreateAppointmentDTO {
  private String annotations;
  @NotNull private Long patient_id;
  @NotNull private Long physician_id;

  @NotNull @Future private LocalDateTime time;
}
