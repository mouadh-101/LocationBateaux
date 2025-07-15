package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.dto.partner.PartnerAddDto;
import org.nst.bateaux.dto.partner.PartnerDto;
import org.nst.bateaux.service.Interface.IPartnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.springframework.security.authorization.AuthorityReactiveAuthorizationManager.hasRole;

@RestController
@AllArgsConstructor
@RequestMapping("/api/partner")

public class PartnerController {
    @Autowired
    IPartnerService partnerService;
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PartnerDto ajouterPartner(
            @RequestParam("nom") String nom,
            @RequestParam("logoFile") MultipartFile logoFile
    ) {
        PartnerAddDto dto = new PartnerAddDto();
        dto.setNom(nom);
        dto.setLogoFile(logoFile);
        return partnerService.ajouterPartner(dto);
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public void supprimerPartner(Long id){
        partnerService.supprimerPartner(id);
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PartnerDto updatePartner(
            @PathVariable("id") Long id,
            @RequestParam("nom") String nom,
            @RequestParam(value = "logoFile", required = false) MultipartFile logoFile
    ) {
        PartnerAddDto dto = new PartnerAddDto();
        dto.setNom(nom);
        dto.setLogoFile(logoFile);  // peut être null si non envoyé

        return partnerService.updatePartner(id, dto);
    }

    @GetMapping("/{id}")
    public PartnerDto findPartnerbyId(@PathVariable("id") Long id){
        return partnerService.findPartnerbyId(id);
    }
    @GetMapping("/list")
    public List<PartnerDto> getAll(){
        return partnerService.getAll();
    }
}
