package com.usguri.health_hub.patient;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdatePatientDTO {
    private String firstname;
    private String lastname;
    @Past
    private LocalDate dbo;
    @Email
    private String email;
}
