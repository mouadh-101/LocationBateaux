package org.nst.bateaux.service.Interface;

import org.nst.bateaux.dto.paiement.PaimentData;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Paiement;

import java.util.List;
import java.util.Optional;

public interface IPaiementService {

    PaimentData ajouterPaiement(Long idReservation ,PaimentData paiement) ;
    void supprimerPaiement(Long id);
    PaimentData updatePaiement(Long id,PaimentData paiement);
    List<PaimentData> getAll();
    Optional<PaimentData> getPaiementById(Long id);

}
