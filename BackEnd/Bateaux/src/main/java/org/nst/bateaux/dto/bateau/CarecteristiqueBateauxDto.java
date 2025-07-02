package org.nst.bateaux.dto.bateau;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.nst.bateaux.entity.TypeBateux;
@NoArgsConstructor
@AllArgsConstructor
@Data


public class CarecteristiqueBateauxDto {
    Long idCarecteristique;
    int capacite;
    double longueur;
    double largeur;
    int nombreMoteurs;
    TypeBateux type;
}
