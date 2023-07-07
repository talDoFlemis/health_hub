package com.usguri.health_hub.patient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "patient")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Patient {
  @Id @GeneratedValue private Long id;
  @NotNull private String firstname;
  @NotNull private String lastname;
  @NotNull private LocalDate dbo;

  @Column(unique = true)
  @NotNull
  @Email
  private String email;
}
