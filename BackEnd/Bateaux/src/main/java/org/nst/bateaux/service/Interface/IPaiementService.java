package org.nst.bateaux.service.Interface;

import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Paiement;

import java.util.List;
import java.util.Optional;

public interface IPaiementService {

    Paiement ajouterPaiement(Paiement paiement) ;
    void supprimerPaiement(Long id);
    Paiement updatePaiement(Long id,Paiement paiement);
    Optional<Paiement> chercherPaiement(Long id);
    List<Paiement> getAll();

}
