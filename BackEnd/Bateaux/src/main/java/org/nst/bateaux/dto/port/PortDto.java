package org.nst.bateaux.dto.port;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.nst.bateaux.dto.bateau.BateauData;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortDto {
    long portId;
    String nom;
    List<BateauData> bateaux;
}
