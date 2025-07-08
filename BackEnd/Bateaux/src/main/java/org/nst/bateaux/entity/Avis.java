package org.nst.bateaux.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Avis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    Long avisId ;
    Integer note ;
    String commentaire ;
    LocalDateTime dateCreation ;
    @ManyToOne
    private User utilisateur;
    @ManyToOne
    private Bateaux bateau;

}
