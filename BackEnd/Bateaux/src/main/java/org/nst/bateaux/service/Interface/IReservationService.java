package org.nst.bateaux.service.Interface;

import org.nst.bateaux.dto.reservation.ReservationAdd;
import org.nst.bateaux.dto.reservation.ReservationData;
import org.nst.bateaux.entity.Reservation;

import java.util.List;
import java.util.Optional;

public interface IReservationService {

    ReservationData ajouterReservation(ReservationAdd reservation,Long bateauId,Long userId) ;

    void supprimerReservation(Long id);
    ReservationData updateReservation(Long id,ReservationData reservation);
    ReservationData getReservationById(Long id);
    List<ReservationData> getAll();
    ReservationData mapToDto(Reservation reservation);
    ReservationAdd mapToAddDto(Reservation reservation);
    List <ReservationData> getCurrentUserReservations(Long userId);

}
