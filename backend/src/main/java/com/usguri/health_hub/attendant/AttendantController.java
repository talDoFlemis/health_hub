package com.usguri.health_hub.attendant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "${apiPrefix}/attendant")
public class AttendantController {
    private final AttendantService attendantService;

    @Autowired
    public AttendantController(AttendantService attendantService){
        this.attendantService = attendantService;
    }

    @GetMapping
    public List<Attendant> getAttendants() {
        return this.attendantService.getAll();
    }

    @GetMapping("/{id}")
    public Attendant getPatientById(@PathVariable Long id) {
        Optional<Attendant> attendant =  this.attendantService.findById(id);
        if (attendant.isPresent()){
            return attendant.get();
        }else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "attendant with id: " + id + " was not found");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Attendant registerPatient(){
        return this.attendantService.createAttendant();
    }
}
