package org.nst.bateaux.service.mappers;

import org.nst.bateaux.dto.avis.AviData;
import org.nst.bateaux.dto.bateau.BateauData;
import org.nst.bateaux.dto.bateau.CarecteristiqueBateauxDto;
import org.nst.bateaux.dto.bateau.ImageDto;
import org.nst.bateaux.dto.port.PortAddDto;
import org.nst.bateaux.dto.port.PortDto;
import org.nst.bateaux.dto.reservation.ReservationAdd;
import org.nst.bateaux.dto.reservation.ReservationData;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MapToDto {
    //Carecteristique Bateaux :
    public CarecteristiqueBateauxDto maptoDtoCarecteristique(Carecteristique caracteristique) {
        if (caracteristique == null) {
            return null;
        }
        return new CarecteristiqueBateauxDto(
                caracteristique.getIdCarecteristique(),
                caracteristique.getCapacite(),
                caracteristique.getLongueur(),
                caracteristique.getLargeur(),
                caracteristique.getNombreMoteurs(),
                caracteristique.getType()
        );
    }
    // Bateaux
    public BateauData mapToBatauxDto(Bateaux bateau) {
        List<ImageDto> images = bateau.getImages().stream()
                .map(img -> new ImageDto(img.getImageId(), img.getUrl()))
                .toList();
        List<ReservationAdd> reservation= bateau.getReservations().stream()
                .map(res -> mapToAddReservationDto(res))
                .toList();

        return new BateauData(
                bateau.getBateauxId(),
                bateau.getNom(),
                bateau.getDescription(),
                bateau.getPrix(),
                images,
                bateau.isDisponible(),
                bateau.getAvis().stream()
                        .map(avis -> mapToAvisDto(avis)).toList(),
                reservation,
                mapToPortAddDto(bateau.getPort()),
                maptoDtoCarecteristique(bateau.getCarecteristique())


        );
    }
    // Avis
    public AviData mapToAvisDto(Avis avis) {
        AviData aviData = new AviData();
        aviData.setAvisId(avis.getAvisId());
        aviData.setNote(avis.getNote());
        aviData.setCommentaire(avis.getCommentaire());
        aviData.setDateCreation(avis.getDateCreation());
        aviData.setUtilisateur(mapToDtoWithName(avis.getUtilisateur()));
        return aviData;
    }
    // Reservation
    public ReservationData mapToReservationDto(Reservation reservation) {
        ReservationData reservationData = new ReservationData();
        reservationData.setReservationId(reservation.getReservationId());
        reservationData.setDateDebut(reservation.getDateDebut());
        reservationData.setDateFin(reservation.getDateFin());
        reservationData.setNbPersonnes(reservation.getNbPersonnes());
        reservationData.setStatus(reservation.getStatus());
        reservationData.setUtilisateur(mapToDtoWithName(reservation.getUtilisateur()));
        reservationData.setBateau(mapToBatauxDto(reservation.getBateau()));
        return reservationData;
    }

    public ReservationAdd mapToAddReservationDto(Reservation reservation) {
        ReservationAdd reservationAdd = new ReservationAdd();
        reservationAdd.setDateDebut(reservation.getDateDebut());
        reservationAdd.setDateFin(reservation.getDateFin());
        reservationAdd.setNbPersonnes(reservation.getNbPersonnes());
        reservationAdd.setStatus(reservation.getStatus());
        return reservationAdd;
    }

    //User :
    public UserData mapToUserDto(User user) {
        UserData userData = new UserData();
        userData.setId(user.getId());
        userData.setEmail(user.getEmail());
        userData.setRole(user.getRole());
        userData.setIsActive(user.isActive());
        return userData;
    }
    public UserDataWithName mapToDtoWithName(User user) {
        UserDataWithName userDataWithName = new UserDataWithName();
        userDataWithName.setId(user.getId());
        userDataWithName.setEmail(user.getEmail());
        userDataWithName.setRole(user.getRole());
        userDataWithName.setIsActive(user.isActive());
        userDataWithName.setName(user.getName());
        return userDataWithName;
    }
    //Port :
    PortDto mapToPortDto(Port port) {
        List<BateauData> bateaux = port.getBateaux().stream()
                .map(this::mapToBatauxDto)
                .toList();
        return new PortDto(port.getIdPort(), port.getNom(), bateaux);
    }
    PortAddDto mapToPortAddDto(Port port) {
        return new PortAddDto(port.getIdPort(), port.getNom());
    }
}
