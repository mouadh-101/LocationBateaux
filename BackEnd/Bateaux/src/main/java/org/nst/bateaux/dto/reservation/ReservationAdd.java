package org.nst.bateaux.dto.reservation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.nst.bateaux.entity.StatusRes;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor

public class ReservationAdd {
    LocalDateTime dateDebut ;
    LocalDateTime dateFin ;
    int nbPersonnes;
    StatusRes status;
}
