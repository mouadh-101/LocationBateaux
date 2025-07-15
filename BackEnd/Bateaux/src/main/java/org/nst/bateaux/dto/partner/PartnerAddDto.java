package org.nst.bateaux.dto.partner;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PartnerAddDto {
    String nom;
    MultipartFile logoFile;
}
