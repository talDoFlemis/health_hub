package com.usguri.health_hub.appointment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.usguri.health_hub.patient.Patient;
import com.usguri.health_hub.physician.Physician;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "appointment")
public class Appointment {
  @Id @GeneratedValue private Long id;

  @Column(columnDefinition = "TEXT")
  private String annotations;

  private LocalDateTime time;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "patient_id")
  @JsonIgnore
  private Patient patient;

  @Column(name = "patient_id", insertable = false, updatable = false)
  private Long patientId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "physician_id")
  @JsonIgnore
  private Physician physician;

  @Column(name = "physician_id", insertable = false, updatable = false)
  private Long physicianId;
}
