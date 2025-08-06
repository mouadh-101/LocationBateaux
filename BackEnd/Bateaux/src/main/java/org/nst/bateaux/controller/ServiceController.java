package org.nst.bateaux.controller;


import org.nst.bateaux.dto.port.PortAddDto;
import org.nst.bateaux.dto.service.ServiceData;
import org.nst.bateaux.dto.user.UserData;
import org.nst.bateaux.service.Interface.IPortService;
import org.nst.bateaux.service.Interface.IServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    IServiceService serviceService;
    @GetMapping
    public ResponseEntity<List<ServiceData>> getAllService() {
        UserData loggedInUser = (UserData) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(serviceService.getAll(loggedInUser.getId()));
    }
}
