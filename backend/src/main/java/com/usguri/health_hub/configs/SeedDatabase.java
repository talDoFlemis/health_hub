package com.usguri.health_hub.configs;

import com.usguri.health_hub.appointment.Appointment;
import com.usguri.health_hub.appointment.AppointmentRepository;
import com.usguri.health_hub.patient.Patient;
import com.usguri.health_hub.patient.PatientRepository;
import com.usguri.health_hub.physician.Physician;
import com.usguri.health_hub.physician.PhysicianRepository;
import com.usguri.health_hub.physician.Speciality;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class SeedDatabase implements CommandLineRunner {
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    AppointmentRepository appointmentRepository;
    @Autowired
    PhysicianRepository physicianRepository;

    @Override
    public void run(String... args) throws Exception {
        loadUserData();
    }

    private void loadUserData() {
        if (patientRepository.count() == 0) {
            Patient pat1 = new Patient("Lg", LocalDate.now().minusYears(19), "lg@test.com");
            Patient pat2 = new Patient("Tubias", LocalDate.now().minusYears(30), "tubias@test.com");
            patientRepository.save(pat1);
            patientRepository.save(pat2);

            Physician phy1 = new Physician("House", "drhouse@md.com", Speciality.Emergency);
            Physician phy2 = new Physician("Gepeto", "drgepeto@md.com", Speciality.Gynecology);
            physicianRepository.save(phy1);
            physicianRepository.save(phy2);

            Appointment app1 = new Appointment(pat1, phy1, LocalDateTime.now());
            Appointment app2 = new Appointment(pat1, phy2, LocalDateTime.now().minusMonths(2));
            Appointment app3 = new Appointment(pat2, phy1, LocalDateTime.now().plusMonths(2));
            Appointment app4 = new Appointment(pat2, phy2, LocalDateTime.now().plusYears(1));
            appointmentRepository.save(app1);
            appointmentRepository.save(app2);
            appointmentRepository.save(app3);
            appointmentRepository.save(app4);
        }
        System.out.println(patientRepository.count());
        System.out.println(physicianRepository.count());
        System.out.println(appointmentRepository.count());
    }
}
