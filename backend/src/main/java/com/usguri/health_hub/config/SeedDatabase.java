package com.usguri.health_hub.config;

import com.usguri.health_hub.patient.Patient;
import com.usguri.health_hub.patient.PatientRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SeedDatabase implements CommandLineRunner {
  private final PatientRepository patientRepository;

  @Override
  public void run(String... args) throws Exception {
    loadUserData();
  }

  private void loadUserData() {
    if (patientRepository.count() == 0) {
      Patient pat1 = new Patient("Lg", "Dos Santos", LocalDate.now().minusYears(19), "lg@test.com");
      Patient pat2 =
          new Patient("Tubias", "Souza", LocalDate.now().minusYears(30), "tubias@test.com");
      patientRepository.save(pat1);
      patientRepository.save(pat2);
    }
    System.out.println(patientRepository.count());
  }
}
