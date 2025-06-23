package org.nst.bateaux.service.Implimentation;
import lombok.AllArgsConstructor;
import org.nst.bateaux.entity.Avis;
import org.nst.bateaux.entity.Image;
import org.nst.bateaux.repository.AvisRepository;
import org.nst.bateaux.service.Interface.IAvisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class AvisService implements IAvisService {

    @Autowired
    AvisRepository avisRepository ;


    @Override
    public Avis ajouterAvis(Avis avis)
    {
        return avisRepository.save(avis);
    }

    @Override
    public void supprimerAvis(Long id)
    {
        avisRepository.deleteById(id);
    }

    @Override
    public Avis updateAvis(Long id,Avis avis)
    {
        Avis i=avisRepository.findById(id).orElse(null);
        i.setNote(avis.getNote());
        i.setCommentaire(avis.getCommentaire());
        i.setDateCreation(avis.getDateCreation());
        return avisRepository.save(i);
    }

    @Override
    public Optional<Avis> chercherAvis(Long id)
    {
        return avisRepository.findById(id);
    }

    @Override
    public List<Avis> getAll() {return avisRepository.findAll();}
}
