package com.usguri.health_hub.physician;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdatePhysicianDTO {
  private String name;
  @Email private String email;

  @Enumerated(EnumType.STRING)
  private Specialty specialty;
}
