package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.entity.Avis;
import org.nst.bateaux.entity.Image;
import org.nst.bateaux.service.Implimentation.AvisService;
import org.nst.bateaux.service.Implimentation.BateauxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/avis")
public class AvisController {

    @Autowired
    AvisService avisService;

    @PostMapping(path = "/AddAvis")
    Avis ajouterAvis (@RequestBody Avis avis) {return avisService.ajouterAvis(avis);}


    @DeleteMapping(path = "/{id}")
    void supprimerAvis(@PathVariable Long id)
    {
        avisService.supprimerAvis(id);
    }

    @PutMapping(path = "/{id}")
    Avis updateAvis(@PathVariable Long id,@RequestBody Avis avis)
    {
        return avisService.updateAvis(id,avis);
    }

    @GetMapping(path = "/{id}")
    Optional<Avis> chercherAvis(@PathVariable Long id)
    {return avisService.chercherAvis(id);}

    @GetMapping("/list")
    public ResponseEntity<List<Avis>> getAll() {
        return new ResponseEntity<>(avisService.getAll(), HttpStatus.CREATED);
    }

}
