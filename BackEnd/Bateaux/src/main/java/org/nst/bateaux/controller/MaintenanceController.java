package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.entity.Avis;
import org.nst.bateaux.entity.Maintenance;
import org.nst.bateaux.service.Implimentation.BateauxService;
import org.nst.bateaux.service.Implimentation.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/maintenance")
public class MaintenanceController {


    @Autowired
    MaintenanceService maintenanceService;

    @PostMapping(path = "/AddMaintenance")
    Maintenance ajouterMaintenance (@RequestBody Maintenance maintenance) {return maintenanceService.ajouterMaintenance(maintenance);}

    @DeleteMapping(path = "/{id}")
    void supprimerMaintenance(@PathVariable Long id)
    {
        maintenanceService.supprimerMaintenance(id);
    }

    @PutMapping(path = "/{id}")
    Maintenance updateMaintenance(@PathVariable Long id,@RequestBody Maintenance maintenance)
    {
        return maintenanceService.updateMaintenance(id,maintenance);
    }

    @GetMapping(path = "/{id}")
    Optional<Maintenance> chercherMaintenance(@PathVariable Long id)
    {return maintenanceService.chercherMaintenance(id);}

    @GetMapping("/list")
    public ResponseEntity<List<Maintenance>> getAll() {
        return new ResponseEntity<>(maintenanceService.getAll(), HttpStatus.CREATED);
    }
}
