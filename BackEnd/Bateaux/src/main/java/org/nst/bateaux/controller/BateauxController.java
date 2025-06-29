package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.dto.bateau.BateauData;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.service.Implimentation.BateauxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/bateaux")
public class BateauxController {

    @Autowired
    BateauxService bateauxService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BateauData> ajouterBateaux(@RequestBody BateauData bateaux) {
        UserData loggedInUser = (UserData) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        BateauData saved = bateauxService.ajouterBateaux(bateaux, loggedInUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping(path = "/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> supprimerBateaux(@PathVariable Long id) {
        bateauxService.supprimerBateaux(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(path = "/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BateauData> updateBateaux(@PathVariable Long id, @RequestBody BateauData bateaux) {
        BateauData updated = bateauxService.updateBateaux(id, bateaux);
        return ResponseEntity.ok(updated);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<BateauData> getBateauxById(@PathVariable Long id) {
        BateauData bateau = bateauxService.getBateauxById(id);
        return ResponseEntity.ok(bateau);
    }

    @GetMapping("/list")
    public ResponseEntity<List<BateauData>> getAll() {
        List<BateauData> bateaux = bateauxService.getAll();
        return ResponseEntity.ok(bateaux);
    }
    @GetMapping("/list/top5")
    public ResponseEntity<List<BateauData>> getTop5() {
        List<BateauData> bateaux = bateauxService.getTop5BateauxByNote();
        return ResponseEntity.ok(bateaux);
    }
}
