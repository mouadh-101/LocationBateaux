package org.nst.bateaux.dto.bateau;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor

public class BoatSearchRequest {
    private String port;
    private int nbPersonnes;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDateTime dateDebut;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDateTime dateFin;
}
