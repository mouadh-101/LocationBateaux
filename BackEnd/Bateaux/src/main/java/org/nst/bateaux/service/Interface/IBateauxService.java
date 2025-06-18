package org.nst.bateaux.service.Interface;

import org.nst.bateaux.dto.bateau.BateauData;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Reservation;

import java.util.List;
import java.util.Optional;

public interface IBateauxService {


    BateauData ajouterBateaux(BateauData bateaux,Long adminId) ;
    void supprimerBateaux(Long id);
    BateauData updateBateaux(Long id,BateauData bateaux);
    BateauData getBateauxById(Long id);
    List<BateauData> getAll();
}
