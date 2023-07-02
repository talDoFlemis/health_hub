package com.usguri.health_hub.physician;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="physician")
public class Physician {
    @Id
    @SequenceGenerator(
            name="physician",
            sequenceName = "physician_sequence",
            allocationSize = 1)

    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "physician_sequence")
    private Long id;
    @NotNull
    private String name;
    @NotNull
    @Email
    private String email;
    @Enumerated(EnumType.STRING)
    private Specialty specialty;

}