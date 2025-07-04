package org.nst.bateaux.controller;


import org.nst.bateaux.dto.port.PortAddDto;
import org.nst.bateaux.service.Interface.IPortService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ports")
public class PortController {

    @Autowired
    IPortService portService;
    @GetMapping
    public ResponseEntity<List<PortAddDto>> getAllPorts() {
        return ResponseEntity.ok(portService.getAllPorts());
    }
}
