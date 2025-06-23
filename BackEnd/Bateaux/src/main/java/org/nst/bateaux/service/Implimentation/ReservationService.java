package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
import org.nst.bateaux.dto.reservation.ReservationAdd;
import org.nst.bateaux.dto.reservation.ReservationData;
import org.nst.bateaux.entity.Reservation;
import org.nst.bateaux.entity.StatusRes;
import org.nst.bateaux.repository.BateauxRepository;
import org.nst.bateaux.repository.ReservationRepository;
import org.nst.bateaux.repository.UserRepository;
import org.nst.bateaux.service.Interface.IBateauxService;
import org.nst.bateaux.service.Interface.IReservationService;
import org.nst.bateaux.service.Interface.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ReservationService implements IReservationService {

    @Autowired
    ReservationRepository reservationRepository ;
    @Autowired
    BateauxRepository bateauxRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    IBateauxService bateauxService;
    @Autowired
    IUserService userService;




    @Override
    public ReservationData ajouterReservation(ReservationAdd reservation,Long bateauId,Long userId)
    {

        Reservation res = new Reservation();
        res.setDateDebut(reservation.getDateDebut());
        res.setDateFin(reservation.getDateFin());
        res.setStatus(StatusRes.EN_ATTENTE);
        res.setBateau(bateauxRepository.findById(bateauId).orElseThrow(() -> new RuntimeException("Bateau not found")));
        res.setUtilisateur(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")));
        
        return mapToDto(reservationRepository.save(res));
    }

    @Override
    public void supprimerReservation(Long id)
    {
        reservationRepository.deleteById(id);
    }

    @Override
    public ReservationData updateReservation(Long id,ReservationData reservation)
    {
        Reservation i=reservationRepository.findById(id).orElse(null);
        i.setDateDebut(reservation.getDateDebut());
        i.setDateFin(reservation.getDateFin());
        i.setStatus(reservation.getStatus());
        return mapToDto(reservationRepository.save(i));
    }

    @Override
    public ReservationData getReservationById(Long id)
    {
        return mapToDto(reservationRepository.findById(id).orElse(null));
    }

    @Override
    public List<ReservationData> getAll() {
        List<ReservationData> reservations =new ArrayList<>();
        for(Reservation i : reservationRepository.findAll()) {
            reservations.add(mapToDto(i));
        }
        return reservations;
    }
    @Override
    public ReservationData mapToDto(Reservation reservation) {
        ReservationData reservationData = new ReservationData();
        reservationData.setReservationId(reservation.getReservationId());
        reservationData.setDateDebut(reservation.getDateDebut());
        reservationData.setDateFin(reservation.getDateFin());
        reservationData.setStatus(reservation.getStatus());
        reservationData.setUtilisateur(userService.mapToDto(reservation.getUtilisateur()));
        reservationData.setBateau(bateauxService.mapToDto(reservation.getBateau()));
        return reservationData;
    }

    @Override
    public List<ReservationData> getCurrentUserReservations(Long userId) {
        List<ReservationData> reservations = new ArrayList<>();
        for (Reservation reservation : reservationRepository.findByUtilisateur(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")))) {
            reservations.add(mapToDto(reservation));
        }
        return reservations;
    }

}
