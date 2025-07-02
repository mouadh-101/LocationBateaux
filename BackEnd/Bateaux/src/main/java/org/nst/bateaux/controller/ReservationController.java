package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.dto.reservation.ReservationAdd;
import org.nst.bateaux.dto.reservation.ReservationData;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.service.Implimentation.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/reservation")
public class ReservationController {

    @Autowired
    ReservationService reservationService;

    @PostMapping(path = "/{idBateau}")
    public ResponseEntity<ReservationData> ajouterReservation(@RequestBody ReservationAdd reservation, @PathVariable Long idBateau) {

        UserData loggedInUser = (UserData) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ReservationData created = reservationService.ajouterReservation(reservation, idBateau, loggedInUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> supprimerReservation(@PathVariable Long id) {
        reservationService.supprimerReservation(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(path = "/{id}")
    public ResponseEntity<ReservationData> updateReservation(
            @PathVariable Long id,
            @RequestBody ReservationData reservation) {

        ReservationData updated = reservationService.updateReservation(id, reservation);
        return ResponseEntity.ok(updated);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<ReservationData> getReservationById(@PathVariable Long id) {
        ReservationData reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(reservation);
    }

    @GetMapping("/list")
    public ResponseEntity<List<ReservationData>> getAll() {
        List<ReservationData> reservations = reservationService.getAll();
        return ResponseEntity.ok(reservations);
    }
    @GetMapping("/current-user")
    public ResponseEntity<List<ReservationData>> getCurrentUserReservations() {
        UserData loggedInUser = (UserData) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<ReservationData> reservations = reservationService.getCurrentUserReservations(loggedInUser.getId());
        return ResponseEntity.ok(reservations);
    }

}
