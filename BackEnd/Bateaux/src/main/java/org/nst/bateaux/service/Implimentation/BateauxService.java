package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
import org.nst.bateaux.dto.bateau.BateauData;
import org.nst.bateaux.dto.bateau.ImageDto;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Image;
import org.nst.bateaux.entity.Reservation;
import org.nst.bateaux.entity.User;
import org.nst.bateaux.repository.BateauxRepository;
import org.nst.bateaux.repository.UserRepository;
import org.nst.bateaux.service.Interface.IBateauxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class BateauxService implements IBateauxService {
    @Autowired
    BateauxRepository bateauxRepository ;
    @Autowired
    UserRepository userRepository;

    @Override
    public Bateaux ajouterBateaux(BateauData bateaux , Long adminId)
    {
        User user=userRepository.findById(adminId).orElseThrow(()->new RuntimeException("user not found"));
        Bateaux newBat=new Bateaux();
        newBat.setNom(bateaux.getNom());
        newBat.setDescription(bateaux.getDescription());
        newBat.setPrix(bateaux.getPrix());
        newBat.setProprietaire(user);
        for (ImageDto i : bateaux.getImages())
        {
            Image im =new Image();
            im.setUrl(i.getUrl());
            im.setBateau(newBat);
            newBat.getImages().add(im);
        }
        return bateauxRepository.save(newBat);
    }

    @Override
    public void supprimerBateaux(Long id)
    {
        bateauxRepository.deleteById(id);
    }

    @Override
    public Bateaux updateBateaux(Long id,Bateaux bateaux)
    {
        Bateaux i=bateauxRepository.findById(id).orElse(null);
        i.setNom(bateaux.getNom());
        i.setDescription(bateaux.getDescription());
        i.setPrix(bateaux.getPrix());
        return bateauxRepository.save(i);
    }

    @Override
    public Optional<Bateaux> chercherBateaux(Long id)
    {
        return bateauxRepository.findById(id);
    }

    @Override
    public List<Bateaux> getAll() {return bateauxRepository.findAll();}
}
