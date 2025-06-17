package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
import org.nst.bateaux.entity.Reservation;
import org.nst.bateaux.repository.ReservationRepository;
import org.nst.bateaux.service.Interface.IReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ReservationService implements IReservationService {

    @Autowired
    ReservationRepository reservationRepository ;


    @Override
    public Reservation ajouterReservation(Reservation reservation)
    {
        return reservationRepository.save(reservation);
    }

    @Override
    public void supprimerReservation(Long id)
    {
        reservationRepository.deleteById(id);
    }

    @Override
    public Reservation updateReservation(Long id,Reservation reservation)
    {
        Reservation i=reservationRepository.findById(id).orElse(null);
        i.setDateDebut(reservation.getDateDebut());
        i.setDateFin(reservation.getDateFin());
        i.setStatus(reservation.getStatus());
        return reservationRepository.save(i);
    }

    @Override
    public Optional<Reservation> chercherReservation(Long id)
    {
        return reservationRepository.findById(id);
    }

    @Override
    public List<Reservation> getAll() {return reservationRepository.findAll();}

}
