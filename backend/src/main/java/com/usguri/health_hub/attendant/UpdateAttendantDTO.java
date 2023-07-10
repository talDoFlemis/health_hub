package com.usguri.health_hub.attendant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;
import lombok.Data;

@Data
public class UpdateAttendantDTO {
  private String firstname;
  private String lastname;
  @Past private LocalDate dbo;
  @Email private String email;
}
