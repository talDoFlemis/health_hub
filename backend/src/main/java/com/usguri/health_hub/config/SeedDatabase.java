package com.usguri.health_hub.config;

import com.usguri.health_hub.appointment.Appointment;
import com.usguri.health_hub.appointment.AppointmentRaw;
import com.usguri.health_hub.appointment.AppointmentRepository;
import com.usguri.health_hub.patient.Patient;
import com.usguri.health_hub.patient.PatientRepository;
import com.usguri.health_hub.physician.Physician;
import com.usguri.health_hub.physician.PhysicianRepository;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SeedDatabase implements CommandLineRunner {
  private final PatientRepository patientRepository;
  private final PhysicianRepository physicianRepository;
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

  boolean db_empty() {
    return patientRepository.count() == 0 && physicianRepository.count() == 0;
  }

  private void loadUserData() throws IOException {
    boolean db_empty = db_empty();
    if (patientRepository.count() == 0) {
      List<Patient> patients = getListFromCSV(Patient.class, "src/main/resources/patients.csv");
      patientRepository.saveAll(patients);
    }
    if (physicianRepository.count() == 0) {
      List<Physician> physicians =
          getListFromCSV(Physician.class, "src/main/resources/physicians.csv");
      physicianRepository.saveAll(physicians);
    }
    if (db_empty) {
      List<AppointmentRaw> appointmentRaws =
          getListFromCSV(AppointmentRaw.class, "src/main/resources/appointments.csv");
      List<Appointment> appointments = new ArrayList<>();
      appointmentRaws.forEach(
          a -> {
            Patient patient = patientRepository.findById(a.getPatient_id()).orElseThrow();
            Physician physician = physicianRepository.findById(a.getPhysician_id()).orElseThrow();
            Appointment appointment =
                Appointment.builder()
                    .id(a.getId())
                    .annotations(a.getAnnotations())
                    .time(a.getTime())
                    .patient(patient)
                    .physician(physician)
                    .build();
            appointments.add(appointment);
          });
      appointmentRepository.saveAll(appointments);
    }
    System.out.println("Patient count" + patientRepository.count());
    System.out.println("Physician count" + physicianRepository.count());
    System.out.println("Appointment count" + appointmentRepository.count());
  }
}
