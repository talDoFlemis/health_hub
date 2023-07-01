package com.usguri.health_hub.user;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@RequiredArgsConstructor
public enum Role {
  ADMIN(
      Set.of(
          Permission.ADMIN_READ,
          Permission.ADMIN_CREATE,
          Permission.ADMIN_UPDATE,
          Permission.ADMIN_DELETE,
          Permission.ATTENDANT_READ,
          Permission.ATTENDANT_CREATE,
          Permission.ATTENDANT_UPDATE,
          Permission.ATTENDANT_DELETE,
          Permission.PATIENT_READ,
          Permission.PATIENT_CREATE,
          Permission.PATIENT_UPDATE,
          Permission.PATIENT_DELETE,
          Permission.PHYSICIAN_READ,
          Permission.PHYSICIAN_CREATE,
          Permission.PHYSICIAN_UPDATE,
          Permission.PHYSICIAN_DELETE)),
  ATTENDANT(
      Set.of(
          Permission.ATTENDANT_READ,
          Permission.ATTENDANT_CREATE,
          Permission.ATTENDANT_UPDATE,
          Permission.ATTENDANT_DELETE)),
  PATIENT(
      Set.of(
          Permission.PATIENT_READ,
          Permission.PATIENT_CREATE,
          Permission.PATIENT_UPDATE,
          Permission.PATIENT_DELETE)),
  PHYSICIAN(
      Set.of(
          Permission.PHYSICIAN_READ,
          Permission.PHYSICIAN_CREATE,
          Permission.PHYSICIAN_UPDATE,
          Permission.PHYSICIAN_DELETE)),
  ;
  @Getter private final Set<Permission> permissions;

  public List<SimpleGrantedAuthority> getAuthorities() {
    var authorities =
        getPermissions().stream()
            .map(perm -> new SimpleGrantedAuthority(perm.getPermission()))
            .collect(Collectors.toList());
    authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
    return authorities;
  }
}
