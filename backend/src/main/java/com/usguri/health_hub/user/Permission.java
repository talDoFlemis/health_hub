package com.usguri.health_hub.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {
  ADMIN_READ("admin:read"),
  ADMIN_UPDATE("admin:update"),
  ADMIN_CREATE("admin:create"),
  ADMIN_DELETE("admin:delete"),
  ATTENDANT_READ("attendant:read"),
  ATTENDANT_UPDATE("attendant:update"),
  ATTENDANT_CREATE("attendant:create"),
  ATTENDANT_DELETE("attendant:delete"),
  PHYSICIAN_READ("physician:read"),
  PHYSICIAN_UPDATE("physician:update"),
  PHYSICIAN_CREATE("physician:create"),
  PHYSICIAN_DELETE("physician:delete"),
  PATIENT_READ("patient:read"),
  PATIENT_UPDATE("patient:update"),
  PATIENT_CREATE("patient:create"),
  PATIENT_DELETE("patient:delete"),
  ;
  @Getter private final String permission;
}
