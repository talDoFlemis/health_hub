package com.usguri.health_hub.patient;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.Period;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "patient")
public class Patient {
    @Id
    @GeneratedValue
    private Long id;
    @NotNull
    private String firstname;
    @NotNull
    private String lastname;
    @NotNull
    private LocalDate dbo;
    @Transient
    private Integer age;
    @Column(unique = true)
    @NotNull
    @Email
    private String email;

    public Patient(String firstname, String lastname, LocalDate dbo, String mail) {
        setFirstname(firstname);
        setLastname(lastname);
        setDbo(dbo);
        setEmail(mail);
    }

    public Integer getAge() {
        return Period.between(this.getDbo(), LocalDate.now()).getYears();
    }
}
