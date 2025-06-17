package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.entity.Reservation;
import org.nst.bateaux.service.Implimentation.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/Resrvation")
public class ReservationController {
    @Autowired
    ReservationService reservationService;
    @PostMapping(path = "/AddReservation")
    Reservation ajouterReservation (@RequestBody Reservation reservation) {return reservationService.ajouterReservation(reservation);}


    @DeleteMapping(path = "/Reservation/{id}")
    void supprimerReservation(@PathVariable Long id)
    {
        reservationService.supprimerReservation(id);
    }

    @PutMapping(path = "/Reservation/update/{id}")
    Reservation updateReservation(@PathVariable Long id,@RequestBody Reservation reservation)
    {
        return reservationService.updateReservation(id,reservation);
    }

    @GetMapping(path = "/Reservation/{id}")
    Optional<Reservation> chercherReservation(@PathVariable Long id)
    {return reservationService.chercherReservation(id);}

    @GetMapping("/list")
    public ResponseEntity<List<Reservation>> getAll() {
        return new ResponseEntity<>(reservationService.getAll(), HttpStatus.CREATED);
    }


}
