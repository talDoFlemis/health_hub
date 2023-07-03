package com.usguri.health_hub.appointment;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class BetweenDatesDTO {
  @NotNull private LocalDateTime start;

  @NotNull private LocalDateTime end;
}
