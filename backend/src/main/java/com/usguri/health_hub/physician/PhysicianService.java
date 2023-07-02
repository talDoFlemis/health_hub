package com.usguri.health_hub.physician;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;
import java.util.Optional;


@Service
public class PhysicianService {
    private final PhysicianRepository physicianRepository;
    @Autowired
    public PhysicianService(PhysicianRepository physicianRepository){
        this.physicianRepository = physicianRepository;
    }

    public List<Physician> getPhysicians(){
        return physicianRepository.findAll();
    }

    public void addNewPhysician(Physician physician) {

        Optional<Physician> physicianOptional = physicianRepository.findPhysicianByEmail(physician.getEmail());
        if (physicianOptional.isPresent()){
            throw new IllegalStateException("email taken");
        }
        physicianRepository.save(physician);
    }

    public void deletePhysician(Long physicianId) {
        boolean exists = physicianRepository.existsById(physicianId);
        if (!exists){
            throw new IllegalStateException("physician with id "+ physicianId + " does not exist");
        }
        physicianRepository.deleteById(physicianId);
    }

    @Transactional
    public void updatePhysician(Long physicianId, String name, String email, Specialty specialty) {
        Physician physician = physicianRepository.findPhysicianById(physicianId).
                orElseThrow(()-> new IllegalStateException("physician with id "+ physicianId +" does not exist"));

        if(name != null && name.length()>0 && !Objects.equals(physician.getName(), name)){
            physician.setName(name);
        }
        if(email != null &&
                email.length()>0 &&
                !Objects.equals(physician.getEmail(), email)){
            Optional<Physician> physicianOptional = physicianRepository.findPhysicianByEmail(email);
            if (physicianOptional.isPresent()){
                throw new IllegalStateException("email taken");
            }
            physician.setEmail(email);
        }

        if(!Objects.equals(physician.getSpecialty(), specialty)){
            try {
                Specialty.valueOf(specialty.name());
            } catch (IllegalArgumentException e) {
                throw new IllegalStateException("Specialty unavailable");
            }
            physician.setSpecialty(specialty);
        }




    }
}
