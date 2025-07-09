package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
import org.nst.bateaux.config.BusinessException;
import org.nst.bateaux.dto.avis.AviData;
import org.nst.bateaux.dto.bateau.BateauData;
import org.nst.bateaux.dto.bateau.ImageDto;
import org.nst.bateaux.dto.reservation.ReservationAdd;
import org.nst.bateaux.dto.reservation.ReservationData;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Reservation;
import org.nst.bateaux.entity.StatusRes;
import org.nst.bateaux.repository.BateauxRepository;
import org.nst.bateaux.repository.ReservationRepository;
import org.nst.bateaux.repository.UserRepository;
import org.nst.bateaux.service.Interface.IBateauxService;
import org.nst.bateaux.service.Interface.IReservationService;
import org.nst.bateaux.service.Interface.IUserService;
import org.nst.bateaux.service.mappers.MapToDto;
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
    IUserService userService;
    @Autowired
    MapToDto mapToDto;


    @Override
    public ReservationData ajouterReservation(ReservationAdd reservation, Long bateauId, Long userId) {
        Bateaux bat = bateauxRepository.findById(bateauId)
                .orElseThrow(() -> new BusinessException("Bateau not found"));

        if (!bat.isDisponible()) {
            throw new BusinessException("Bateau not disponible");
        }

        // Get all reservations of this boat
        List<Reservation> existingReservations = reservationRepository.findByBateauAndStatus(bat, StatusRes.ACCEPTER);
        for (Reservation existing : existingReservations) {
            boolean overlap = reservation.getDate()==existing.getDate();
            if (overlap) {
                throw new BusinessException("La date sélectionnées est déjà réservées.");
            }
        }

        Reservation res = new Reservation();
        res.setDate(reservation.getDate());
        res.setTypeReservation(reservation.getTypeReservation());
        res.setNbPersonnes(reservation.getNbPersonnes());
        res.setStatus(StatusRes.EN_ATTENTE);
        res.setBateau(bat);
        res.setUtilisateur(userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found")));

        return mapToDto.mapToReservationDto(reservationRepository.save(res));
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
        i.setDate(reservation.getDate());
        i.setTypeReservation(reservation.getTypeReservation());
        i.setStatus(reservation.getStatus());
        i.setNbPersonnes(reservation.getNbPersonnes());
        return mapToDto.mapToReservationDto(reservationRepository.save(i));
    }

    @Override
    public ReservationData getReservationById(Long id)
    {
        return mapToDto.mapToReservationDto(reservationRepository.findById(id).orElse(null));
    }

    @Override
    public List<ReservationData> getAll() {
        List<ReservationData> reservations =new ArrayList<>();
        for(Reservation i : reservationRepository.findAll()) {
            reservations.add(mapToDto.mapToReservationDto(i));
        }
        return reservations;
    }


    @Override
    public List<ReservationData> getCurrentUserReservations(Long userId) {
        List<ReservationData> reservations = new ArrayList<>();
        for (Reservation reservation : reservationRepository.findByUtilisateur(userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found")))) {
            reservations.add(mapToDto.mapToReservationDto(reservation));
        }
        return reservations;
    }

}
