package com.usguri.health_hub.config;

import com.usguri.health_hub.appointment.AppointmentRepository;
import com.usguri.health_hub.patient.Patient;
import com.usguri.health_hub.patient.PatientRepository;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SeedDatabase implements CommandLineRunner {
  private final PatientRepository patientRepository;
  private final AppointmentRepository appointmentRepository;

  private <T> List<T> getListFromCSV(Class<T> clazz, String fileName) throws IOException {
    File file = new File(fileName);
    InputStream stream = new FileInputStream(file);
    return CsvUtils.read(clazz, stream);
  }

  @Override
  public void run(String... args) throws Exception {
    loadUserData();
  }

  private void loadUserData() throws IOException {
    if (patientRepository.count() == 0) {
      List<Patient> patients = getListFromCSV(Patient.class, "src/main/resources/patients.csv");
      patientRepository.saveAll(patients);
    }
    System.out.println("Patient count" + patientRepository.count());
    System.out.println("Appointment count" + appointmentRepository.count());
  }
}
