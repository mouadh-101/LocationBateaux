package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Reservation;
import org.nst.bateaux.service.Implimentation.BateauxService;
import org.nst.bateaux.service.Implimentation.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/Bateaux")
public class BateauxController {

    @Autowired
    BateauxService bateauxService;

    @PostMapping(path = "/AddBateaux")
    Bateaux ajouterBateaux (@RequestBody Bateaux bateaux) {return bateauxService.ajouterBateaux(bateaux);}


    @DeleteMapping(path = "/Bateaux/{id}")
    void supprimerBateaux(@PathVariable Long id)
    {
        bateauxService.supprimerBateaux(id);
    }

    @PutMapping(path = "/Bateaux/update/{id}")
    Bateaux updateBateaux(@PathVariable Long id,@RequestBody Bateaux bateaux)
    {
        return bateauxService.updateBateaux(id,bateaux);
    }

    @GetMapping(path = "/Bateaux/{id}")
    Optional<Bateaux> chercherBateaux(@PathVariable Long id)
    {return bateauxService.chercherBateaux(id);}

    @GetMapping("/list")
    public ResponseEntity<List<Bateaux>> getAll() {
        return new ResponseEntity<>(bateauxService.getAll(), HttpStatus.CREATED);
    }

}
