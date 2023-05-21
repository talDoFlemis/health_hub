package com.usguri.health_hub.patient;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.Period;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "patient")
public class Patient {
    @Id
    @SequenceGenerator(name= "patient_sequence", sequenceName = "patient_sequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "patient_sequence")
    private Long id;
    private String name;
    private LocalDate dbo;
    @Transient
    private Integer age;
    @Column(unique=true)
    private String email;

    public Patient(String name, LocalDate dbo, String email){
        this.name = name;
        this.dbo = dbo;
        this.email = email;
    }

    public Integer getAge() {
        return Period.between(this.getDbo(), LocalDate.now()).getYears();
    }
}
