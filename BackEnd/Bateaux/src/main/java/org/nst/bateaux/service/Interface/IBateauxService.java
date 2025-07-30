package org.nst.bateaux.service.Interface;

import org.nst.bateaux.dto.bateau.BateauData;
import org.nst.bateaux.entity.Role;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface IBateauxService {


    BateauData ajouterBateaux(BateauData bateaux,Long adminId) ;
    void supprimerBateaux(Long id);
    BateauData updateBateaux(Long id, BateauData bateaux, Role role);
    BateauData getBateauxById(Long id);
    List<BateauData> getAll();
    List<BateauData> getTop5BateauxByNote();
    BateauData favoritBateau(Long userId, Long bateauId);
    List<BateauData> getFavoritBateaux(Long userId);
    List<BateauData> chercherBateaux(String portName,int nbPersonnes,LocalDateTime date);

    List<BateauData> getBateauxByProprietaireId(Long userId);
}
