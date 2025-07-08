package org.nst.bateaux.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    Long paiementId ;
    double montant ;
    LocalDateTime datePaiement ;
    @Enumerated(EnumType.STRING)
    MethodePai methode ;
    @Enumerated(EnumType.STRING)
    StatusRes status ;
    @OneToOne
    private Reservation reservation;

}
