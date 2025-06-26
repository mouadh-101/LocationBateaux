package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
import org.nst.bateaux.dto.avis.AviData;
import org.nst.bateaux.dto.bateau.BateauData;
import org.nst.bateaux.dto.bateau.ImageDto;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Image;
import org.nst.bateaux.entity.Reservation;
import org.nst.bateaux.entity.User;
import org.nst.bateaux.repository.BateauxRepository;
import org.nst.bateaux.repository.UserRepository;
import org.nst.bateaux.service.Interface.IBateauxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    public BateauData ajouterBateaux(BateauData bateaux , Long adminId) {
        User user=userRepository.findById(adminId).orElseThrow(()->new RuntimeException("user not found"));
        Bateaux newBat=new Bateaux();
        newBat.setNom(bateaux.getNom());
        newBat.setDescription(bateaux.getDescription());
        newBat.setPrix(bateaux.getPrix());
        newBat.setProprietaire(user);
        newBat.setDisponible(true);
        for (ImageDto i : bateaux.getImages())
        {
            Image im =new Image();
            im.setUrl(i.getUrl());
            im.setBateau(newBat);
            newBat.getImages().add(im);
        }
        return mapToDto(bateauxRepository.save(newBat));
    }

    @Override
    public void supprimerBateaux(Long id)
    {
        bateauxRepository.deleteById(id);
    }

    @Override
    public BateauData updateBateaux(Long id, BateauData bateauxDto) {
        Bateaux b = bateauxRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bateau not found"));

        b.setNom(bateauxDto.getNom());
        b.setDescription(bateauxDto.getDescription());
        b.setPrix(bateauxDto.getPrix());
        b.getImages().clear();
        for (ImageDto i : bateauxDto.getImages()) {
            Image im = new Image();
            im.setUrl(i.getUrl());
            im.setBateau(b); // Set back-reference
            b.getImages().add(im);
        }

        return mapToDto(bateauxRepository.save(b));
    }


    @Override
    public BateauData getBateauxById(Long id)
    {
        return mapToDto(bateauxRepository.findById(id).orElse(null));
    }

    @Override
    public List<BateauData> getAll() {
        List<Bateaux> bateauxList = bateauxRepository.findAll();
        return bateauxList.stream().map(this::mapToDto).toList();
    }

    @Override
    public BateauData mapToDto(Bateaux bateau) {
        List<ImageDto> images = bateau.getImages().stream()
                .map(img -> new ImageDto(img.getImageId(), img.getUrl()))
                .toList();

        return new BateauData(
                bateau.getBateauxId(),
                bateau.getNom(),
                bateau.getDescription(),
                bateau.getPrix(),
                images,
                bateau.isDisponible(),
                bateau.getAvis().stream()
                        .map(avis -> new AviData(
                                avis.getAvisId(),
                                avis.getNote(),
                                avis.getCommentaire(),
                                avis.getDateCreation(),
                                new UserDataWithName(avis.getUtilisateur().getId(), avis.getUtilisateur().getName(), avis.getUtilisateur().getEmail(), avis.getUtilisateur().getRole(), avis.getUtilisateur().isActive()),
                                new BateauData(avis.getBateau().getBateauxId(), avis.getBateau().getNom(), null, 0, null, true, null)
                        )).toList()
        );
    }

    @Override
    public List<BateauData> getTop5BateauxByNote() {
        List<BateauData> bateauxList = new ArrayList<>();
        for (Bateaux bateau : bateauxRepository.findTop5ByOrderByAvisNoteDesc()) {
            bateauxList.add(mapToDto(bateau));
        }

        return bateauxList;
    }
}
