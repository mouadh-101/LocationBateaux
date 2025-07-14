package org.nst.bateaux.service.Interface;

import org.nst.bateaux.dto.partner.PartnerDto;
import org.nst.bateaux.entity.Image;

import java.util.List;
import java.util.Optional;

public interface IPartnerService {

    PartnerDto ajouterPartner(PartnerDto partnerDto) ;
    void supprimerPartner(Long id);
    PartnerDto updatePartner(Long id,PartnerDto partnerDto);
    PartnerDto findPartnerbyId(Long id);
    List<PartnerDto> getAll();
}
