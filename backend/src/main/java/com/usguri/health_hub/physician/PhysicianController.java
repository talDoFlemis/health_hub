package com.usguri.health_hub.physician;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping(path="/physician")
public class PhysicianController {
    private final PhysicianService physicianService;

    @Autowired
    public PhysicianController(PhysicianService physicianService) {
        this.physicianService = physicianService;
    }

    @GetMapping
    @PreAuthorize(value = "hasAnyRole('ADMIN', 'PHYSICIAN')")
    public List<Physician> getPhysicians(){
        return physicianService.getPhysicians();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize(value = "hasAnyRole('ADMIN', 'PHYSICIAN')")
    public void registerNewPhysician(@RequestBody Physician physician){
        physicianService.addNewPhysician(physician);
    }

    @DeleteMapping(path="{physicianId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize(value = "hasAnyRole('ADMIN', 'PHYSICIAN')")
    public void deletePhysician(@PathVariable("physicianId") Long physicianId){
        physicianService.deletePhysician(physicianId);
    }
    @PatchMapping(path="{physicianId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize(value = "hasAnyRole('ADMIN', 'PHYSICIAN')")
    public Physician updatePhysician(@Valid @RequestBody UpdatePhysicianDTO pat,
                @PathVariable Long physicianId){
        return this.physicianService.updatePhysician(pat, physicianId);
    }

}
