package org.nst.bateaux.dto.reservation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor

public class ReservationAdd {
    LocalDateTime DateDebut ;
    LocalDateTime DateFin ;
}
