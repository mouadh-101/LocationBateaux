package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
import org.nst.bateaux.config.BusinessException;
import org.nst.bateaux.dto.bateau.BateauData;
import org.nst.bateaux.dto.bateau.CarecteristiqueBateauxDto;
import org.nst.bateaux.dto.bateau.ImageDto;
import org.nst.bateaux.entity.*;
import org.nst.bateaux.repository.BateauxRepository;
import org.nst.bateaux.repository.ImageRepository;
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
    @Autowired
    ImageRepository imageRepository;

    @Override
    public BateauData ajouterBateaux(BateauData bateaux, Long adminId) {
        User user = userRepository.findById(adminId)
                .orElseThrow(() -> new BusinessException("user not found"));

        Port port = portRepository.findByNomAndIsDeletedFalse(bateaux.getPort().getNom());

        Bateaux newBat = new Bateaux();
        newBat.setNom(bateaux.getNom());
        newBat.setDescription(bateaux.getDescription());
        newBat.setPrix(bateaux.getPrix());
        newBat.setProprietaire(user);
        newBat.setDisponible(true);
        newBat.getReservationTypeSettings().setFull_day_enabled(bateaux.getReservationTypeSettings().isFull_day_enabled());
        newBat.getReservationTypeSettings().setHalf_day_enabled(bateaux.getReservationTypeSettings().isHalf_day_enabled());
        newBat.getReservationTypeSettings().setTwo_hours_enabled(bateaux.getReservationTypeSettings().isTwo_hours_enabled());
        newBat.getReservationTypeSettings().setFullDayPrice(bateaux.getReservationTypeSettings().getFullDayPrice());
        newBat.getReservationTypeSettings().setHalfDayPrice(bateaux.getReservationTypeSettings().getHalfDayPrice());
        newBat.getReservationTypeSettings().setTwoHoursPrice(bateaux.getReservationTypeSettings().getTwoHoursPrice());
        newBat.setCommission(bateaux.getCommission());

        newBat = bateauxRepository.save(newBat); // Save first to link


        if (bateaux.getImages() != null && !bateaux.getImages().isEmpty()) {
            for (ImageDto i : bateaux.getImages()) {
                if (i.getImageId() != null) {
                    Image image = imageRepository.findById(i.getImageId())
                            .orElseThrow(() -> new BusinessException("Image not found with id: " + i.getImageId()));
                    image.setBateau(newBat);
                    imageRepository.save(image);
                    newBat.getImages().add(image);
                }
            }
        }

        CarecteristiqueBateauxDto carecteristiqueData = bateaux.getCarecteristique();
        if (carecteristiqueData != null) {
            Carecteristique caracteristique = new Carecteristique();
            caracteristique.setCapacite(carecteristiqueData.getCapacite());
            caracteristique.setLongueur(carecteristiqueData.getLongueur());
            caracteristique.setLargeur(carecteristiqueData.getLargeur());
            caracteristique.setNombreMoteurs(carecteristiqueData.getNombreMoteurs());
            caracteristique.setType(carecteristiqueData.getType());
            newBat.setCarecteristique(caracteristique);
        }


        if (port == null) {
            Port newPort = new Port();
            newPort.setNom(bateaux.getPort().getNom());
            newPort.getBateaux().add(newBat);
            newBat.setPort(newPort);
            portRepository.save(newPort);
        } else {
            newBat.setPort(port);
        }

        bateauxRepository.save(newBat);

        return mapToDto.mapToBatauxDto(newBat);
    }



    @Override
    public void supprimerBateaux(Long id)
    {
        Bateaux bateau = bateauxRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Bateau not found with ID: " + id));
        bateau.setDeleted(true);
        bateau.getCarecteristique().setDeleted(true);
        bateau.getReservationTypeSettings().setDeleted(true);
        bateau.getImages().forEach(image -> {
            image.setDeleted(true);
            imageRepository.save(image);
        });
        bateauxRepository.save(bateau);
    }

    @Override
    public BateauData updateBateaux(Long id, BateauData bateauxDto,Role role) {
        Bateaux existingBateau = bateauxRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Bateau not found"));

        existingBateau.setNom(bateauxDto.getNom());
        existingBateau.setDescription(bateauxDto.getDescription());
        existingBateau.setPrix(bateauxDto.getPrix());
        existingBateau.getImages().clear();
        existingBateau.setDisponible(bateauxDto.isDisponible());
        for (ImageDto i : bateauxDto.getImages()) {
            Image im = new Image();
            im.setUrl(i.getUrl());
            im.setBateau(existingBateau); // Set back-reference
            existingBateau.getImages().add(im);
        }
        CarecteristiqueBateauxDto carecteristiqueData = bateauxDto.getCarecteristique();
        Carecteristique caracteristique = new Carecteristique();
        caracteristique.setCapacite(carecteristiqueData.getCapacite());
        caracteristique.setLongueur(carecteristiqueData.getLongueur());
        caracteristique.setLargeur(carecteristiqueData.getLargeur());
        caracteristique.setNombreMoteurs(carecteristiqueData.getNombreMoteurs());
        caracteristique.setType(carecteristiqueData.getType());
        existingBateau.setCarecteristique(caracteristique);
        existingBateau.getReservationTypeSettings().setFull_day_enabled(bateauxDto.getReservationTypeSettings().isFull_day_enabled());
        existingBateau.getReservationTypeSettings().setHalf_day_enabled(bateauxDto.getReservationTypeSettings().isHalf_day_enabled());
        existingBateau.getReservationTypeSettings().setTwo_hours_enabled(bateauxDto.getReservationTypeSettings().isTwo_hours_enabled());
        existingBateau.getReservationTypeSettings().setFullDayPrice(bateauxDto.getReservationTypeSettings().getFullDayPrice());
        existingBateau.getReservationTypeSettings().setHalfDayPrice(bateauxDto.getReservationTypeSettings().getHalfDayPrice());
        existingBateau.getReservationTypeSettings().setTwoHoursPrice(bateauxDto.getReservationTypeSettings().getTwoHoursPrice());

        if (role==Role.ADMIN)
        {
            existingBateau.setCommission(bateauxDto.getCommission());
        }

        return mapToDto.mapToBatauxDto(bateauxRepository.save(existingBateau));
    }


    @Override
    public BateauData getBateauxById(Long id)
    {
        return mapToDto.mapToBatauxDto(bateauxRepository.findByBateauxIdAndIsDeletedFalse(id));
    }

    @Override
    public List<BateauData> getAll() {
        List<Bateaux> bateauxList = bateauxRepository.findAllByIsDeletedFalse();
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
    public List<BateauData> chercherBateaux(String portName, int nbPersonnes, LocalDateTime date) {
        List<Bateaux> bateauxList = bateauxRepository.searchAvailableBoats(portName, nbPersonnes, date);
        return bateauxList.stream().map(bat -> mapToDto.mapToBatauxDto(bat)).toList();
    }


}
