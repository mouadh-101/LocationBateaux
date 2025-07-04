package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
import org.nst.bateaux.config.BusinessException;
import org.nst.bateaux.dto.bateau.BateauData;
import org.nst.bateaux.dto.bateau.CarecteristiqueBateauxDto;
import org.nst.bateaux.dto.bateau.ImageDto;
import org.nst.bateaux.entity.*;
import org.nst.bateaux.repository.BateauxRepository;
import org.nst.bateaux.repository.PortRepository;
import org.nst.bateaux.repository.UserRepository;
import org.nst.bateaux.service.Interface.IBateauxService;
import org.nst.bateaux.service.mappers.MapToDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class BateauxService implements IBateauxService {
    @Autowired
    BateauxRepository bateauxRepository ;
    @Autowired
    UserRepository userRepository;
    @Autowired
    MapToDto mapToDto;
    @Autowired
    PortRepository portRepository;

    @Override
    public BateauData ajouterBateaux(BateauData bateaux , Long adminId) {
        User user=userRepository.findById(adminId).orElseThrow(()->new BusinessException("user not found"));
        Port port = portRepository.findByNom(bateaux.getPort().getNom());
        if (port == null) {
            Port newPort = new Port();
            newPort.setNom(bateaux.getPort().getNom());
            newPort.getBateaux().add(new Bateaux());
            port=portRepository.save(newPort);
        }

        Bateaux newBat = new Bateaux();
        newBat.setNom(bateaux.getNom());
        newBat.setDescription(bateaux.getDescription());
        newBat.setPrix(bateaux.getPrix());
        newBat.setProprietaire(user);
        newBat.setDisponible(true);
        for (ImageDto i : bateaux.getImages()) {
            Image im = new Image();
            im.setUrl(i.getUrl());
            im.setBateau(newBat);
            newBat.getImages().add(im);
        }
        CarecteristiqueBateauxDto c = bateaux.getCarecteristique();
        Carecteristique caracteristique = new Carecteristique();
        caracteristique.setCapacite(c.getCapacite());
        caracteristique.setLongueur(c.getLongueur());
        caracteristique.setLargeur(c.getLargeur());
        caracteristique.setNombreMoteurs(c.getNombreMoteurs());
        caracteristique.setType(c.getType());
        newBat.setCarecteristique(caracteristique);
        newBat.setPort(port);
        return mapToDto.mapToBatauxDto(bateauxRepository.save(newBat));

    }

    @Override
    public void supprimerBateaux(Long id)
    {
        bateauxRepository.deleteById(id);
    }

    @Override
    public BateauData updateBateaux(Long id, BateauData bateauxDto) {
        Bateaux b = bateauxRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Bateau not found"));

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
        CarecteristiqueBateauxDto c = bateauxDto.getCarecteristique();
        Carecteristique caracteristique = new Carecteristique();
        caracteristique.setCapacite(c.getCapacite());
        caracteristique.setLongueur(c.getLongueur());
        caracteristique.setLargeur(c.getLargeur());
        caracteristique.setNombreMoteurs(c.getNombreMoteurs());
        caracteristique.setType(c.getType());
        b.setCarecteristique(caracteristique);

        return mapToDto.mapToBatauxDto(bateauxRepository.save(b));
    }


    @Override
    public BateauData getBateauxById(Long id)
    {
        return mapToDto.mapToBatauxDto(bateauxRepository.findById(id).orElse(null));
    }

    @Override
    public List<BateauData> getAll() {
        List<Bateaux> bateauxList = bateauxRepository.findAll();
        return bateauxList.stream().map(bat -> mapToDto.mapToBatauxDto(bat)).toList();
    }



    @Override
    public List<BateauData> getTop5BateauxByNote() {
        List<BateauData> bateauxList = new ArrayList<>();
        for (Bateaux bateau : bateauxRepository.findTop5ByOrderByAvisNoteDesc()) {
            bateauxList.add(mapToDto.mapToBatauxDto(bateau));
        }

        return bateauxList;
    }

    @Override
    public BateauData favoritBateau(Long userId, Long bateauId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found with ID: " + userId));

        // Assuming you have a method to find a Bateau by its ID
        Bateaux bateau = bateauxRepository.findById(bateauId)
                .orElseThrow(() -> new BusinessException("Bateau not found with ID: " + bateauId));
        // Check if the bateau is already in user's favorites
        if (user.getFavourit().contains(bateau)) {
            user.getFavourit().remove(bateau);
            userRepository.save(user);

            return mapToDto.mapToBatauxDto(bateau);
        }
        user.getFavourit().add(bateau);
        userRepository.save(user);

        return mapToDto.mapToBatauxDto(bateau);
    }



    @Override
    public List<BateauData> getFavoritBateaux(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found with ID: " + userId));

        return user.getFavourit().stream()
                .map(bateau -> mapToDto.mapToBatauxDto(bateau)).toList();
    }

    @Override
    public List<BateauData> chercherBateaux(String portName, int nbPersonnes, LocalDateTime dateDebut, LocalDateTime dateFin) {
        List<Bateaux> bateauxList = bateauxRepository.searchAvailableBoats(portName, nbPersonnes, dateDebut, dateFin);
        return bateauxList.stream().map(bat -> mapToDto.mapToBatauxDto(bat)).toList();
    }


}
