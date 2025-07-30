package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.dto.paiement.PaimentData;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.service.Implimentation.PaiementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/paiement")
public class PaiementController {

    @Autowired
    PaiementService paiementService;



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
    @GetMapping("/list/user")
    public ResponseEntity<List<PaimentData>> getPaimentByUser() {
        UserData loggedInUser = (UserData) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<PaimentData> paiements = paiementService.getPaimentByUser(loggedInUser.getId());
        return ResponseEntity.ok(paiements);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<PaimentData>> getPaimentById(@PathVariable("id")Long id) {
        Optional<PaimentData> paiements = paiementService.getPaiementById(id);
        return ResponseEntity.ok(paiements);
    }
    @PostMapping("/{id}/stripe-session")
    public ResponseEntity<Map<String, String>> createStripeSession(@PathVariable Long id){
        return paiementService.createStripeSession(id);
    }
    @GetMapping("/{id}/paypal-order")
    public ResponseEntity<Map<String, String>> createPaypalOrder(@PathVariable Long id) {
        try {
            String approvalUrl = paiementService.createPaypalOrder(id);
            return ResponseEntity.ok(Map.of("approvalUrl", approvalUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create PayPal order"));
        }
    }
    @PostMapping("/capture-order")
    public String captureOrder(@RequestParam String orderId) {
        return paiementService.captureOrder(orderId);
    }


    @GetMapping("/Paie-gest")
    public ResponseEntity<List<PaimentData>> getPaiementsByGestionnaire() {
        UserData loggedInUser = (UserData) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<PaimentData> paiements = paiementService.getPaiementsForGestionnaire(loggedInUser.getId());
        return ResponseEntity.ok(paiements);
    }


}
