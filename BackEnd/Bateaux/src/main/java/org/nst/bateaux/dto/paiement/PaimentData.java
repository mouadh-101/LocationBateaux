package org.nst.bateaux.dto.paiement;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.nst.bateaux.dto.reservation.ReservationData;
import org.nst.bateaux.entity.MethodePai;
import org.nst.bateaux.entity.Reservation;
import org.nst.bateaux.entity.StatusRes;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaimentData {
    Long paiementId ;
    double montant ;
    LocalDateTime datePaiement ;
    MethodePai methode ;
    StatusRes status ;
    ReservationData reservation;
}
