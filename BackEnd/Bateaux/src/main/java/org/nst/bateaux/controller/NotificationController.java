package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.entity.Maintenance;
import org.nst.bateaux.entity.Notification;
import org.nst.bateaux.service.Implimentation.BateauxService;
import org.nst.bateaux.service.Implimentation.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/notification")
public class NotificationController {

    @Autowired
    NotificationService notificationService;

    @PostMapping(path = "/AddNotification")
    Notification ajouterNotification(@RequestBody Notification notification) {return notificationService.ajouterNotification(notification);}

    @DeleteMapping(path = "/{id}")
    void supprimerNotification(@PathVariable Long id)
    {
        notificationService.supprimerNotification(id);
    }

    @PutMapping(path = "/{id}")
    Notification updateNotification(@PathVariable Long id,@RequestBody Notification notification)
    {
        return notificationService.updateNotification(id,notification);
    }

    @GetMapping(path = "/{id}")
    Optional<Notification> chercherNotification(@PathVariable Long id)
    {return notificationService.chercherNotification(id);}

    @GetMapping("/list")
    public ResponseEntity<List<Notification>> getAll() {
        return new ResponseEntity<>(notificationService.getAll(), HttpStatus.CREATED);
    }
}
