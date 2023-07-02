package com.usguri.health_hub.attendant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AttendantService {
    private final AttendantRepository attendantRepository;

    @Autowired
    public AttendantService(AttendantRepository attendantRepository) {
        this.attendantRepository = attendantRepository;
    }

    public List<Attendant> getAll() {
        return this.attendantRepository.findAll();
    }

    public Optional<Attendant> findById(Long id) {
        return this.attendantRepository.findById(id);
    }

    public Attendant createAttendant() {
        return this.attendantRepository.save();
    }

    public void deleteAttendant(Long id) {
        this.attendantRepository.deleteById(id);
    }
}
