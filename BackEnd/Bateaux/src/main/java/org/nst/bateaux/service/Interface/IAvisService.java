package org.nst.bateaux.service.Interface;
import org.nst.bateaux.dto.avis.AviData;
import org.nst.bateaux.entity.Avis;
import java.util.List;

public interface IAvisService {

    AviData ajouterAvis(AviData avis, Long bateauId, Long userId); ;
    void supprimerAvis(Long id);
    AviData updateAvis(Long id,AviData avis);
    AviData getAvisById(Long id);
    List<AviData> getAll();
    AviData mapToDto(Avis avis);
    List<AviData> getAllAvisByBataeuxId(Long bateauId);

}
