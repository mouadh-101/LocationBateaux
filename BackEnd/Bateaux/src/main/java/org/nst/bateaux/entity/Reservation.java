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
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    Long reservationId ;
    LocalDateTime date ;
    @Enumerated(EnumType.STRING)
    TypeReservation typeReservation;
    int nbPersonnes;
    @Enumerated(EnumType.STRING)
    StatusRes status ;
    @ManyToOne
    private User utilisateur;
    @ManyToOne
    private Bateaux bateau;
    @OneToOne(mappedBy = "reservation",cascade = CascadeType.ALL)
    private Paiement paiement;
    @Column(nullable = false)
    boolean isDeleted=false;

}
