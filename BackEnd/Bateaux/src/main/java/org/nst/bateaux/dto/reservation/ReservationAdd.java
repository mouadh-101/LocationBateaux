package org.nst.bateaux.dto.reservation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.nst.bateaux.entity.StatusRes;
import org.nst.bateaux.entity.TypeReservation;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor

public class ReservationAdd {
    LocalDateTime date ;
    TypeReservation typeReservation;
    int nbPersonnes;
    StatusRes status;
}
