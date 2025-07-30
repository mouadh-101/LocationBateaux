package org.nst.bateaux.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Carecteristique {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long idCarecteristique;
    int capacite;
    double longueur;
    double largeur;
    int nombreMoteurs;
    @Enumerated(EnumType.STRING)
    TypeBateux type;
    @Column(nullable = false)
    boolean isDeleted=false;
}
