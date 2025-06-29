package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
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


    @Override
    public ReservationData ajouterReservation(ReservationAdd reservation, Long bateauId, Long userId) {
        Bateaux bat = bateauxRepository.findById(bateauId)
                .orElseThrow(() -> new RuntimeException("Bateau not found"));

        if (!bat.isDisponible()) {
            throw new RuntimeException("Bateau not disponible");
        }

        // Get all reservations of this boat
        List<Reservation> existingReservations = reservationRepository.findByBateau(bat);

        // Check for overlapping dates
        for (Reservation existing : existingReservations) {
            boolean overlap = reservation.getDateDebut().isBefore(existing.getDateFin()) &&
                    reservation.getDateFin().isAfter(existing.getDateDebut());
            if (overlap) {
                throw new RuntimeException("Les dates sélectionnées sont déjà réservées.");
            }
        }

        Reservation res = new Reservation();
        res.setDateDebut(reservation.getDateDebut());
        res.setDateFin(reservation.getDateFin());
        res.setStatus(StatusRes.EN_ATTENTE);
        res.setBateau(bat);
        res.setUtilisateur(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")));

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
        reservationData.setUtilisateur(userService.mapToDtoWithName(reservation.getUtilisateur()));
        reservationData.setBateau(new BateauData(
                reservation.getBateau().getBateauxId(),
                reservation.getBateau().getNom(),
                reservation.getBateau().getDescription(),
                reservation.getBateau().getPrix(),
                reservation.getBateau().getImages().stream()
                        .map(img -> new ImageDto(img.getImageId(), img.getUrl()))
                        .toList(),
                reservation.getBateau().isDisponible(),
                reservation.getBateau().getAvis().stream()
                        .map(avis -> new AviData(
                                avis.getAvisId(),
                                avis.getNote(),
                                avis.getCommentaire(),
                                avis.getDateCreation(),
                                userService.mapToDtoWithName(avis.getUtilisateur())
                        ))
                        .toList(),
                reservation.getBateau().getReservations().stream()
                        .map(res -> mapToAddDto(res))
                        .toList()
        ));
        return reservationData;
    }

    @Override
    public ReservationAdd mapToAddDto(Reservation reservation) {
        ReservationAdd reservationAdd = new ReservationAdd();
        reservationAdd.setDateDebut(reservation.getDateDebut());
        reservationAdd.setDateFin(reservation.getDateFin());
        return reservationAdd;
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
