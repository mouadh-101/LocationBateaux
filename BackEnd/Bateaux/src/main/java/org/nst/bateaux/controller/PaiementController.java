package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.dto.paiement.PaimentData;
import org.nst.bateaux.service.Implimentation.PaiementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/paiement")
public class PaiementController {

    @Autowired
    PaiementService paiementService;

    @PostMapping("/{idReservation}")
    public ResponseEntity<PaimentData> ajouterPaiement(
            @PathVariable("idReservation") Long idReservation,
            @RequestBody PaimentData paiement) {

        PaimentData created = paiementService.ajouterPaiement(idReservation, paiement);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerPaiement(@PathVariable Long id) {
        paiementService.supprimerPaiement(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaimentData> updatePaiement(
            @PathVariable Long id,
            @RequestBody PaimentData paiement) {

        PaimentData updated = paiementService.updatePaiement(id, paiement);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/list")
    public ResponseEntity<List<PaimentData>> getAll() {
        List<PaimentData> paiements = paiementService.getAll();
        return ResponseEntity.ok(paiements);
    }
}
