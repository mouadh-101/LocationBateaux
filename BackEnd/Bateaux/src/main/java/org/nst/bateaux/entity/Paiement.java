package org.nst.bateaux.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    Long PaiementId ;
    double Montant ;
    @Enumerated(EnumType.STRING)
    MéthodePai methode ;
    @Enumerated(EnumType.STRING)
    StatusRes status ;
    @OneToOne
    private Reservation reservation;

}
