package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
import org.nst.bateaux.config.BusinessException;
import org.nst.bateaux.dto.paiement.PaimentData;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Paiement;
import org.nst.bateaux.entity.Reservation;
import org.nst.bateaux.entity.StatusRes;
import org.nst.bateaux.repository.PaiementRepository;
import org.nst.bateaux.repository.ReservationRepository;
import org.nst.bateaux.service.Interface.IPaiementService;
import org.nst.bateaux.service.mappers.MapToDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PaiementService implements IPaiementService {

    @Autowired
    PaiementRepository paiementRepository ;
    @Autowired
    MapToDto mapToDto;
    @Autowired
    ReservationRepository reservationRepository;

    @Override
    public PaimentData ajouterPaiement(Long idReservation ,PaimentData paiement) {
        Reservation reservation = reservationRepository.findById(idReservation)
                .orElseThrow(() -> new BusinessException("Reservation not found with id: " + idReservation));
        if (reservation.getPaiement() != null) {
            throw new BusinessException("This reservation already has a payment associated with it.");
        }
        Paiement newPaiement = new Paiement();
        newPaiement.setMontant(paiement.getMontant());
        newPaiement.setDatePaiement(LocalDateTime.now());
        newPaiement.setMethode(paiement.getMethode());
        newPaiement.setStatus(StatusRes.EN_ATTENTE);
        newPaiement.setReservation(reservation);

        return mapToDto.mapToPaiementDto(paiementRepository.save(newPaiement));
    }

    @Override
    public void supprimerPaiement(Long id) {
        Paiement paiement = paiementRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Paiement not found with id: " + id));
        paiementRepository.delete(paiement);
    }

    @Override
    public PaimentData updatePaiement(Long id, PaimentData paiement) {
        Paiement existingPaiement = paiementRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Paiement not found with id: " + id));

        existingPaiement.setMontant(paiement.getMontant());
        existingPaiement.setDatePaiement(paiement.getDatePaiement());
        existingPaiement.setMethode(paiement.getMethode());
        existingPaiement.setStatus(paiement.getStatus());

        return mapToDto.mapToPaiementDto(paiementRepository.save(existingPaiement));
    }

    @Override
    public List<PaimentData> getAll() {
        return paiementRepository.findAll().stream()
                .map(mapToDto::mapToPaiementDto)
                .toList();
    }

    @Override
    public Optional<PaimentData> getPaiementById(Long id) {
        return paiementRepository.findById(id)
                .map(mapToDto::mapToPaiementDto)
                .or(() -> Optional.empty());
    }
}
