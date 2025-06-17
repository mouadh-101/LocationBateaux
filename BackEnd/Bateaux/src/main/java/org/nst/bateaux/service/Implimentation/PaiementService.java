package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Paiement;
import org.nst.bateaux.repository.PaiementRepository;
import org.nst.bateaux.service.Interface.IPaiementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PaiementService implements IPaiementService {

    @Autowired
    PaiementRepository paiementRepository ;

    @Override
    public Paiement ajouterPaiement(Paiement paiement)
    {
        return paiementRepository.save(paiement);
    }

    @Override
    public void supprimerPaiement(Long id)
    {
        paiementRepository.deleteById(id);
    }

    @Override
    public Paiement updatePaiement(Long id,Paiement paiement)
    {
        Paiement i=paiementRepository.findById(id).orElse(null);
        i.setMontant(paiement.getMontant());
        i.setMethode(paiement.getMethode());
        i.setStatus(paiement.getStatus());
        return paiementRepository.save(i);
    }

    @Override
    public Optional<Paiement> chercherPaiement(Long id)
    {
        return paiementRepository.findById(id);
    }

    @Override
    public List<Paiement> getAll() {return paiementRepository.findAll();}
}
