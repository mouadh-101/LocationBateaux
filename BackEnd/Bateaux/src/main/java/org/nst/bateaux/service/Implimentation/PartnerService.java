package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
import org.nst.bateaux.config.BusinessException;
import org.nst.bateaux.dto.partner.PartnerAddDto;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PartnerService implements IPartnerService {

    @Autowired
    PartnersRepository partnersRepository ;
    @Autowired
    MapToDto mapToDto;


    @Override
    public PartnerDto ajouterPartner(PartnerAddDto partnerAddDto) {
        String logoUrl = null;

        if (partnerAddDto.getLogoFile() != null && !partnerAddDto.getLogoFile().isEmpty()) {
            try {
                String filename = UUID.randomUUID() + "_" + partnerAddDto.getLogoFile().getOriginalFilename();
                Path path = Paths.get("uploads", filename);
                Files.createDirectories(path.getParent());
                Files.write(path, partnerAddDto.getLogoFile().getBytes());

                logoUrl = "http://localhost:8081/uploads/" + filename;

            } catch (IOException e) {
                throw new BusinessException("Error saving logo file", e);
            }
        }
        Partners partners = new Partners();
        partners.setNom(partnerAddDto.getNom());
        partners.setLogo(logoUrl);
        return mapToDto.mapToPartnerDto(partnersRepository.save(partners));
    }

    @Override
    public void supprimerPartner(Long id) {
        Partners partner = partnersRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Partner not found with ID: " + id));

        String logoUrl = partner.getLogo();
        if (logoUrl != null && !logoUrl.isEmpty()) {
            String filename = logoUrl.substring(logoUrl.lastIndexOf("/") + 1);
            try {
                Files.deleteIfExists(Paths.get("uploads", filename));
            } catch (IOException ignored) {}
        }

        partnersRepository.deleteById(id);
    }


    @Override
    public PartnerDto updatePartner(Long id, PartnerAddDto partnerAddDto) {
        Partners partner = partnersRepository.findById(id)
                .orElseThrow(() -> new BusinessException("partner not found with ID: " + id));

        partner.setNom(partnerAddDto.getNom());

        if (partnerAddDto.getLogoFile() != null && !partnerAddDto.getLogoFile().isEmpty()) {
            // Delete old logo
            String oldLogoUrl = partner.getLogo();
            if (oldLogoUrl != null && !oldLogoUrl.isEmpty()) {
                String oldFilename = oldLogoUrl.substring(oldLogoUrl.lastIndexOf("/") + 1);
                try {
                    Files.deleteIfExists(Paths.get("uploads", oldFilename));
                } catch (IOException ignored) {}
            }

            // Save new logo
            try {
                String filename = UUID.randomUUID() + "_" + partnerAddDto.getLogoFile().getOriginalFilename();
                Path path = Paths.get("uploads", filename);
                Files.createDirectories(path.getParent());
                Files.write(path, partnerAddDto.getLogoFile().getBytes());
                partner.setLogo("http://localhost:8081/uploads/" + filename);
            } catch (IOException e) {
                throw new BusinessException("Error saving logo file", e);
            }
        }

        return mapToDto.mapToPartnerDto(partnersRepository.save(partner));
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
