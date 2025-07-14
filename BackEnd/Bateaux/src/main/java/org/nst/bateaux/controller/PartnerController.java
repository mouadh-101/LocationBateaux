package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.dto.partner.PartnerDto;
import org.nst.bateaux.service.Interface.IPartnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.security.authorization.AuthorityReactiveAuthorizationManager.hasRole;

@RestController
@AllArgsConstructor
@RequestMapping("/api/partner")

public class PartnerController {
    @Autowired
    IPartnerService partnerService;
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public PartnerDto ajouterPartner(@RequestBody PartnerDto partnerDto)
    {
       return partnerService.ajouterPartner(partnerDto);
    }
    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public void supprimerPartner(Long id){
        partnerService.supprimerPartner(id);
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PartnerDto updatePartner(@PathVariable("id") Long id,@RequestBody PartnerDto partnerDto){
        return partnerService.updatePartner(id,partnerDto);
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
