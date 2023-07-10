package com.usguri.health_hub.attendant;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.Period;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "attendant")
public class Attendant {
  @Id @GeneratedValue private Long id;
  private String firstname;
  @NotNull private String lastname;
  @NotNull private LocalDate dbo;
  @Transient private Integer age;

  @Column(unique = true)
  @Email
  private String email;

  public Attendant(String firstname, String lastname, LocalDate dbo, String mail) {
    setFirstname(firstname);
    setLastname(lastname);
    setDbo(dbo);
    setEmail(mail);
  }

  public Integer getAge() {
    return Period.between(this.getDbo(), LocalDate.now()).getYears();
  }
}
