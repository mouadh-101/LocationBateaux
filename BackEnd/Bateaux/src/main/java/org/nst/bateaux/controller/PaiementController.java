package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Paiement;
import org.nst.bateaux.service.Implimentation.BateauxService;
import org.nst.bateaux.service.Implimentation.PaiementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@AllArgsConstructor
@RequestMapping("/api/Paiement")
public class PaiementController {

    @Autowired
    PaiementService paiementService;

    @PostMapping(path = "/AddPaiement")
    Paiement ajouterPaiement (@RequestBody Paiement paiement) {return paiementService.ajouterPaiement(paiement);}


    @DeleteMapping(path = "/{id}")
    void supprimerPaiement(@PathVariable Long id)
    {
        paiementService.supprimerPaiement(id);
    }

    @PutMapping(path = "/{id}")
    Paiement updatePaiement(@PathVariable Long id,@RequestBody Paiement paiement)
    {
        return paiementService.updatePaiement(id,paiement);
    }

    @GetMapping(path = "/{id}")
    Optional<Paiement> chercherPaiement(@PathVariable Long id)
    {return paiementService.chercherPaiement(id);}

    @GetMapping("/list")
    public ResponseEntity<List<Paiement>> getAll() {
        return new ResponseEntity<>(paiementService.getAll(), HttpStatus.CREATED);
    }

}
