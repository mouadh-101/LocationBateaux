package org.nst.bateaux.dto.reservation;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.nst.bateaux.dto.bateau.BateauData;
import org.nst.bateaux.dto.paiement.PaimentData;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.dto.user.UserDataWithName;
import org.nst.bateaux.entity.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationData {
    Long reservationId ;
    LocalDateTime date;
    TypeReservation typeReservation;
    int nbPersonnes;
    StatusRes status ;
    UserDataWithName utilisateur;
    BateauData bateau;
}
