package org.nst.bateaux.controller;

import jakarta.mail.MessagingException;
import org.nst.bateaux.dto.contact.ContactMessageDto;
import org.nst.bateaux.service.Implimentation.MailService;
import org.nst.bateaux.service.Interface.IMailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    @Autowired
    IMailService mailService;

    @PostMapping
    public ResponseEntity<String> sendContactMessage(@RequestBody ContactMessageDto dto) throws MessagingException {
        mailService.sendContactMessageToAdmins(dto);
        return ResponseEntity.ok("Message sent successfully");
    }

}
