package com.usguri.health_hub.appointment;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class AppointmentRaw {
  private Long id;
  private String annotations;

  private LocalDateTime time;

  private Long patient_id;
  private Long physician_id;
}
