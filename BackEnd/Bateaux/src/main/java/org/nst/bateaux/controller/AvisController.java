package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.dto.avis.AviData;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.service.Implimentation.AvisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/avis")
public class AvisController {

    @Autowired
    AvisService avisService;

    @PostMapping("/{bateauxId}")
    public ResponseEntity<AviData> ajouterAvis(@RequestBody AviData avis, @PathVariable("bateauxId") Long bateauxId) {
        UserData loggedInUser = (UserData) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AviData created = avisService.ajouterAvis(avis, bateauxId, loggedInUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerAvis(@PathVariable Long id) {
        avisService.supprimerAvis(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<AviData> updateAvis(@PathVariable Long id, @RequestBody AviData avis) {
        AviData updated = avisService.updateAvis(id, avis);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AviData> getAvisById(@PathVariable Long id) {
        AviData avis = avisService.getAvisById(id);
        return ResponseEntity.ok(avis);
    }

    @GetMapping("/list")
    public ResponseEntity<List<AviData>> getAll() {
        List<AviData> avisList = avisService.getAll();
        return ResponseEntity.ok(avisList);
    }
    @GetMapping("/bateaux/{bateauxId}")
    public ResponseEntity<List<AviData>> getAllAvisByBateauxId(@PathVariable Long bateauxId) {
        List<AviData> avisList = avisService.getAllAvisByBataeuxId(bateauxId);
        return ResponseEntity.ok(avisList);
    }
}
