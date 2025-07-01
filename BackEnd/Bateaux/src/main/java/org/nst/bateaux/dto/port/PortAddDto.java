package org.nst.bateaux.dto.port;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PortAddDto {
    Long idPort;
    String nom;
}
