package org.nst.bateaux.dto.reservation;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.nst.bateaux.dto.bateau.BateauData;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Paiement;
import org.nst.bateaux.entity.StatusRes;
import org.nst.bateaux.entity.User;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationData {
    Long reservationId ;
    LocalDateTime dateDebut ;
    LocalDateTime dateFin ;
    StatusRes status ;
    UserDataWithName utilisateur;
    BateauData bateau;
    Paiement paiement;
}
