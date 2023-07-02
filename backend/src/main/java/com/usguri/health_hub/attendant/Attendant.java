package com.usguri.health_hub.attendant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class Attendant {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
}
