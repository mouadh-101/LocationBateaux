package org.nst.bateaux.dto.partner;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartnerDto {
    Long partnerId ;
    String nom;
    String logo ;
}
