package com.usguri.health_hub.config;

import com.usguri.health_hub.appointment.Appointment;
import com.usguri.health_hub.appointment.AppointmentRaw;
import com.usguri.health_hub.appointment.AppointmentRepository;
import com.usguri.health_hub.patient.Patient;
import com.usguri.health_hub.patient.PatientRepository;
import com.usguri.health_hub.physician.Physician;
import com.usguri.health_hub.physician.PhysicianRepository;
import com.usguri.health_hub.user.Role;
import com.usguri.health_hub.user.User;
import com.usguri.health_hub.user.UserRepository;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Classe responsável por popular o banco de dados com dados iniciais.
 *
 * <p>Esta classe implementa a interface CommandLineRunner do Spring Boot e é executada durante a
 * inicialização da aplicação. Ela carrega dados iniciais para as entidades Patient, Physician,
 * Appointment e User a partir de arquivos CSV e os salva no banco de dados.
 *
 * @author Said Rodrigues
 * @version 1.0
 * @since 2023-07-04
 */
@Component
@RequiredArgsConstructor
public class SeedDatabase implements CommandLineRunner {
  private final PatientRepository patientRepository;
  private final PhysicianRepository physicianRepository;
  private final AppointmentRepository appointmentRepository;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  /**
   * Lê os dados de um arquivo CSV e retorna uma lista de objetos do tipo especificado.
   *
   * <p>Este método lê os dados de um arquivo CSV usando a classe CsvUtils e retorna uma lista de
   * objetos do tipo especificado.
   *
   * @param clazz O tipo dos objetos a serem lidos.
   * @param fileName O nome do arquivo CSV a ser lido.
   * @param <T> O tipo dos objetos a serem lidos.
   * @return Uma lista de objetos do tipo especificado lidos do arquivo CSV.
   * @throws IOException Se ocorrer um erro durante a leitura do arquivo CSV.
   */
  private <T> List<T> getListFromCSV(Class<T> clazz, String fileName) throws IOException {
    File file = new File(fileName);
    InputStream stream = new FileInputStream(file);
    return CsvUtils.read(clazz, stream);
  }

  /**
   * Carrega os dados iniciais para o banco de dados.
   *
   * <p>Este método é executado durante a inicialização da aplicação e carrega os dados iniciais das
   * entidades Patient, Physician, Appointment e User a partir de arquivos CSV e os salva no banco
   * de dados, se o banco estiver vazio.
   *
   * @param args Os argumentos da linha de comando (não utilizados).
   * @throws Exception Se ocorrer algum erro durante o carregamento dos dados.
   */
  @Override
  public void run(String... args) throws Exception {
    loadUserData();
  }

  /**
   * Verifica se o banco de dados está vazio.
   *
   * @return true se o banco de dados estiver vazio, false caso contrário.
   */
  boolean db_empty() {
    return patientRepository.count() == 0 && physicianRepository.count() == 0;
  }

  /**
   * Carrega os dados dos pacientes, médicos e consultas iniciais.
   *
   * <p>Este método carrega os dados dos pacientes e médicos a partir de arquivos CSV e os salva no
   * banco de dados, se o banco estiver vazio. Em seguida, carrega os dados das consultas a partir
   * de um arquivo CSV e as associa aos pacientes e médicos correspondentes.
   *
   * @throws IOException Se ocorrer um erro durante a leitura dos arquivos CSV.
   */
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
    if (userRepository.count() == 0) {
      List<User> users =
          List.of(
              new User(
                  2,
                  "Gepeto",
                  "Souza",
                  "gepeto@healthhub.com",
                  passwordEncoder.encode("1234"),
                  Role.ADMIN,
                  Collections.emptyList()),
              new User(
                  3,
                  "Gabrigas",
                  "Carmo",
                  "gabrigas@healthhub.com",
                  passwordEncoder.encode("1234"),
                  Role.ATTENDANT,
                  Collections.emptyList()),
              new User(
                  4,
                  "Tubias",
                  "Nobre",
                  "tubias@healthhub.com",
                  passwordEncoder.encode("1234"),
                  Role.PATIENT,
                  Collections.emptyList()));
      userRepository.saveAll(users);
      patientRepository.save(
          Patient.builder()
              .firstname("Tubias")
              .lastname("Nobre")
              .dbo(java.time.LocalDate.parse("1999-01-01"))
              .email("tubias@healthhub.com")
              .build());
    }
    System.out.println("Patient count " + patientRepository.count());
    System.out.println("Physician count " + physicianRepository.count());
    System.out.println("Appointment count " + appointmentRepository.count());
    System.out.println("User count " + userRepository.count());
  }
}
