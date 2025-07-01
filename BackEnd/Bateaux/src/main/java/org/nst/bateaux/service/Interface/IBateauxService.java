package org.nst.bateaux.service.Interface;

import org.nst.bateaux.dto.bateau.BateauData;

import java.util.List;

public interface IBateauxService {


    BateauData ajouterBateaux(BateauData bateaux,Long adminId) ;
    void supprimerBateaux(Long id);
    BateauData updateBateaux(Long id,BateauData bateaux);
    BateauData getBateauxById(Long id);
    List<BateauData> getAll();
    List<BateauData> getTop5BateauxByNote();
    BateauData favoritBateau(Long userId, Long bateauId);
    List<BateauData> getFavoritBateaux(Long userId);
}
