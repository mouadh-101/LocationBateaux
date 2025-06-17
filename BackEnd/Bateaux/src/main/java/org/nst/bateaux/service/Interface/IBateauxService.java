package org.nst.bateaux.service.Interface;

import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Reservation;

import java.util.List;
import java.util.Optional;

public interface IBateauxService {


    Bateaux ajouterBateaux(Bateaux bateaux) ;
    void supprimerBateaux(Long id);
    Bateaux updateBateaux(Long id,Bateaux bateaux);
    Optional<Bateaux> chercherBateaux(Long id);
    List<Bateaux> getAll();
}
