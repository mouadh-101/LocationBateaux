package org.nst.bateaux.service.Interface;

import com.stripe.exception.StripeException;
import org.nst.bateaux.dto.paiement.PaimentData;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Paiement;
import org.nst.bateaux.entity.Reservation;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface IPaiementService {

    PaimentData ajouterPaiement(Reservation res) ;
    void supprimerPaiement(Long id);
    PaimentData updatePaiement(Long id,PaimentData paiement);
    List<PaimentData> getAll();
    Optional<PaimentData> getPaiementById(Long id);
    List<PaimentData> getPaimentByUser(Long userId);
    float calculateFees(Reservation reservation);
    ResponseEntity<Map<String, String>> createStripeSession(Long id);


    String createPaypalOrder(Long id) throws IOException;

    String captureOrder(String orderId);

    List<PaimentData> getPaiementsForGestionnaire(Long gestionnaireId);
}
