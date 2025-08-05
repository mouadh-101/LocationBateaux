package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
import org.nst.bateaux.config.BusinessException;
import org.nst.bateaux.dto.paiement.PaimentData;
import org.nst.bateaux.dto.reservation.ReservationAdd;
import org.nst.bateaux.dto.reservation.ReservationData;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Reservation;
import org.nst.bateaux.entity.StatusRes;
import org.nst.bateaux.repository.BateauxRepository;
import org.nst.bateaux.repository.ReservationRepository;
import org.nst.bateaux.repository.UserRepository;
import org.nst.bateaux.service.Interface.*;
import org.nst.bateaux.service.mappers.MapToDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
    IPaiementService paiementService;
    @Autowired
    MapToDto mapToDto;
    @Autowired
    IMailService mailService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;



    @Override
    public ReservationData ajouterReservation(ReservationAdd reservation, Long bateauId, Long userId) {
        Bateaux bat = bateauxRepository.findById(bateauId)
                .orElseThrow(() -> new BusinessException("Bateau not found"));

        if (!bat.isDisponible()) {
            throw new BusinessException("Bateau not disponible");
        }

        List<Reservation> existingReservations = reservationRepository.findByBateauAndStatusAndIsDeletedFalse(bat, StatusRes.ACCEPTER);
        for (Reservation existing : existingReservations) {
            boolean overlap = reservation.getDate().isEqual(existing.getDate());
            if (overlap) {
                throw new BusinessException("La date sélectionnée est déjà réservée.");
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

        Reservation saved = reservationRepository.save(res);

        // Envoi notification WebSocket STOMP
        String notification = "Nouvelle réservation #" + saved.getReservationId() + " pour le bateau " + bat.getNom();
        messagingTemplate.convertAndSend("/topic/reservations", notification);

        return mapToDto.mapToReservationDto(saved);
    }



    @Override
    public void supprimerReservation(Long id)
    {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Reservation not found"));
        reservation.setDeleted(true);
        reservationRepository.deleteById(id);
    }

    @Override
    public ReservationData updateReservation(Long id,ReservationData reservation)
    {
        Reservation reservationExist=reservationRepository.findById(id).orElse(null);
        reservationExist.setDate(reservation.getDate());
        reservationExist.setTypeReservation(reservation.getTypeReservation());
        reservationExist.setStatus(reservation.getStatus());
        reservationExist.setNbPersonnes(reservation.getNbPersonnes());
        reservationExist=reservationRepository.save(reservationExist);
        if (reservationExist.getStatus()==StatusRes.ACCEPTER)
        {
            PaimentData p  =paiementService.ajouterPaiement(reservationExist);
            try {
                mailService.sendReservationConfirmation(reservationExist.getUtilisateur().getEmail(),reservationExist.getUtilisateur().getName(),p.getPaiementId(),p.getMontant(),reservationExist.getBateau(),reservationExist.getDate(),reservationExist.getNbPersonnes());
            }catch (Exception e) {
                throw new BusinessException("Error sending email: " + e.getMessage());
            }
        }

        return mapToDto.mapToReservationDto(reservationExist);
    }

    @Override
    public ReservationData getReservationById(Long id)
    {
        return mapToDto.mapToReservationDto(reservationRepository.findByReservationIdAndIsDeletedFalse(id));
    }

    @Override
    public List<ReservationData> getAll() {
        List<ReservationData> reservations =new ArrayList<>();
        for(Reservation i : reservationRepository.findAllByIsDeletedFalse()) {
            reservations.add(mapToDto.mapToReservationDto(i));
        }
        return reservations;
    }


    @Override
    public List<ReservationData> getCurrentUserReservations(Long userId) {
        List<ReservationData> reservations = new ArrayList<>();
        for (Reservation reservation : reservationRepository.findByUtilisateurAndIsDeletedFalse(userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found")))) {
            reservations.add(mapToDto.mapToReservationDto(reservation));
        }
        return reservations;
    }

    @Override
    public List<ReservationData> getReservationsForGestionnaire(Long gestionnaireId) {
        List<Reservation> reservations = reservationRepository.findByGestionnaireId(gestionnaireId);
        return reservations.stream()
                .map(mapToDto::mapToReservationDto)
                .collect(Collectors.toList());
    }




}
