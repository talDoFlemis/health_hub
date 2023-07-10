package com.usguri.health_hub.physician;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "physician")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Physician {
  @Id @GeneratedValue private Long id;

  private String name;
  private String email;

  @Enumerated(EnumType.STRING)
  private Specialty specialty;
}
