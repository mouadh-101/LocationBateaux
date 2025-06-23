package org.nst.bateaux.service.Interface;
import org.nst.bateaux.entity.Avis;
import java.util.List;
import java.util.Optional;
public interface IAvisService {

    Avis ajouterAvis(Avis avis) ;
    void supprimerAvis(Long id);
    Avis updateAvis(Long id,Avis avis);
    Optional<Avis> chercherAvis(Long id);
    List<Avis> getAll();
}
