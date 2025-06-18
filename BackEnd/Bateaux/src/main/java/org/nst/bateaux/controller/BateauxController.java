package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.dto.bateau.BateauData;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Reservation;
import org.nst.bateaux.service.Implimentation.BateauxService;
import org.nst.bateaux.service.Implimentation.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/bateaux")
public class BateauxController {

    @Autowired
    BateauxService bateauxService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    Bateaux ajouterBateaux (@RequestBody BateauData bateaux) {
        UserData loggedInUser = (UserData) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return bateauxService.ajouterBateaux(bateaux,loggedInUser.getId());
    }


    @DeleteMapping(path = "/{id}")
    void supprimerBateaux(@PathVariable Long id)
    {
        bateauxService.supprimerBateaux(id);
    }

    @PutMapping(path = "/{id}")
    Bateaux updateBateaux(@PathVariable Long id,@RequestBody Bateaux bateaux)
    {
        return bateauxService.updateBateaux(id,bateaux);
    }

    @GetMapping(path = "/{id}")
    Optional<Bateaux> chercherBateaux(@PathVariable Long id)
    {return bateauxService.chercherBateaux(id);}

    @GetMapping("/list")
    public ResponseEntity<List<Bateaux>> getAll() {
        return new ResponseEntity<>(bateauxService.getAll(), HttpStatus.CREATED);

    }

}
