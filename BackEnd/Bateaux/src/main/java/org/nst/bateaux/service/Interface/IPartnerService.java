package org.nst.bateaux.service.Interface;

import org.nst.bateaux.dto.partner.PartnerAddDto;
import org.nst.bateaux.dto.partner.PartnerDto;
import org.nst.bateaux.entity.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface IPartnerService {

    PartnerDto ajouterPartner(PartnerAddDto partnerAddDto) ;
    void supprimerPartner(Long id);
    PartnerDto updatePartner(Long id,PartnerAddDto partnerAddDto);
    PartnerDto findPartnerbyId(Long id);
    List<PartnerDto> getAll();
}
