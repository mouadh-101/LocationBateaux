package org.nst.bateaux.service.Interface;

import jakarta.mail.MessagingException;
import org.nst.bateaux.dto.contact.ContactMessageDto;
import org.nst.bateaux.entity.Bateaux;

import java.time.LocalDateTime;
import java.util.Date;

public interface IMailService {
    public void sendPaiementConfirmation(
            String toEmailClient,
            String toEmailProprietor,
            String clientName,
            String clientPhone,
            Long reservationId,
            Double paymentAmount,
            Bateaux bateaux,
            LocalDateTime date,
            int numberOfPersons
    ) throws MessagingException;

    void sendReservationConfirmation(
            String toEmail,
            String name, Long reservationId, Double paymentAmount,
            Bateaux bateaux,
            LocalDateTime date, int numberOfPersons
    ) throws MessagingException;

    String generateReservationBody(String name, Long reservationId, Double paymentAmount,
                                   Bateaux bateaux,
                                   LocalDateTime date, int numberOfPersons);
    String generatePaymentConfirmationBody(
            String name,                   // recipient name (client or owner)
            Long reservationId,
            Double paymentAmount,
            Bateaux bateaux,
            LocalDateTime date,
            int numberOfPersons,
            boolean isForOwner,           // to personalize
            String clientEmail,
            String clientPhone
    );

    void sendContactMessageToAdmins(ContactMessageDto contactMessageDto) throws MessagingException;

}
