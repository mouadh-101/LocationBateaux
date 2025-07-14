package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
import org.nst.bateaux.config.BusinessException;
import org.nst.bateaux.dto.partner.PartnerDto;
import org.nst.bateaux.entity.Image;
import org.nst.bateaux.entity.Partners;
import org.nst.bateaux.repository.ImageRepository;
import org.nst.bateaux.repository.PartnersRepository;
import org.nst.bateaux.service.Interface.IImageService;
import org.nst.bateaux.service.Interface.IPartnerService;
import org.nst.bateaux.service.mappers.MapToDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PartnerService implements IPartnerService {

    @Autowired
    PartnersRepository partnersRepository ;
    @Autowired
    MapToDto mapToDto;


    @Override
    public PartnerDto ajouterPartner(PartnerDto partnerDto) {
        Partners partners = new Partners();
        partners.setNom(partnerDto.getNom());
        partners.setLogo(partnerDto.getLogo());
        return mapToDto.mapToPartnerDto(partnersRepository.save(partners));
    }

    @Override
    public void supprimerPartner(Long id) {
        partnersRepository.deleteById(id);

    }

    @Override
    public PartnerDto updatePartner(Long id, PartnerDto partnerDto) {
        Partners partners=partnersRepository.findById(id).orElseThrow(() -> new BusinessException("partner not found with ID: " + id));

        partners.setNom(partnerDto.getNom());
        partners.setLogo(partnerDto.getLogo());
        return mapToDto.mapToPartnerDto(partnersRepository.save(partners));
    }

    @Override
    public PartnerDto findPartnerbyId(Long id) {
        return mapToDto.mapToPartnerDto(partnersRepository.findById(id).orElseThrow(() -> new BusinessException("partner not found with ID: " + id)));
    }

    @Override
    public List<PartnerDto> getAll() {
        List<PartnerDto> allPartners =new ArrayList<>();
        for (Partners p : partnersRepository.findAll())
        {
            allPartners.add(mapToDto.mapToPartnerDto(p));
        }
        return allPartners;
    }
}
