package org.nst.bateaux.dto.bateau;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.nst.bateaux.dto.avis.AviData;
import org.nst.bateaux.dto.port.PortAddDto;
import org.nst.bateaux.dto.reservation.ReservationAdd;
import org.nst.bateaux.dto.reservation.ReservationData;
import org.nst.bateaux.entity.Avis;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BateauData {
    long bateauxId;
    String nom ;
    String description ;
    double prix ;
    List<ImageDto> images;
    boolean disponible;
    List<AviData> avis;
    List<ReservationAdd> reservations;
    PortAddDto port;
    CarecteristiqueBateauxDto carecteristique;


}

