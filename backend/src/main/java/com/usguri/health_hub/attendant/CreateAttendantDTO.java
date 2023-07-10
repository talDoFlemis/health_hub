package com.usguri.health_hub.attendant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;
import lombok.Data;

@Data
public class CreateAttendantDTO {
  @NotNull private String firstname;
  @NotNull private String lastname;
  @NotNull @Past private LocalDate dbo;
  @NotNull @Email private String email;
}
