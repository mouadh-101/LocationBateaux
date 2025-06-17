package org.nst.bateaux.service.Interface;

import org.nst.bateaux.entity.Reservation;

import java.util.List;
import java.util.Optional;

public interface IReservationService {

    Reservation ajouterReservation(Reservation reservation) ;

    void supprimerReservation(Long id);
    Reservation updateReservation(Long id,Reservation reservation);
    Optional<Reservation> chercherReservation(Long id);
    List<Reservation> getAll();

}
