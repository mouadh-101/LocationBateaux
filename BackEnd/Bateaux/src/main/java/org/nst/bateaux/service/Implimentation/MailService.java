package org.nst.bateaux.service.Implimentation;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.service.Interface.IMailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MailService implements IMailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;
    @Override
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
    ) throws MessagingException {

        // 1. Email to Client
        MimeMessage clientMessage = mailSender.createMimeMessage();
        MimeMessageHelper clientHelper = new MimeMessageHelper(clientMessage, true, "UTF-8");

        clientHelper.setFrom(fromEmail);
        clientHelper.setTo(toEmailClient);
        clientHelper.setSubject("Paiement confirmé – Merci pour votre réservation");

        String clientHtmlContent = generatePaymentConfirmationBody(
                clientName,
                reservationId,
                paymentAmount,
                bateaux,
                date,
                numberOfPersons,
                false, // isForOwner
                null,
                null
        );
        clientHelper.setText(clientHtmlContent, true);

        mailSender.send(clientMessage);

        // 2. Email to Proprietor
        MimeMessage ownerMessage = mailSender.createMimeMessage();
        MimeMessageHelper ownerHelper = new MimeMessageHelper(ownerMessage, true, "UTF-8");

        ownerHelper.setFrom(fromEmail);
        ownerHelper.setTo(toEmailProprietor);
        ownerHelper.setSubject("Paiement confirmé – Réservation à venir");

        String ownerHtmlContent = generatePaymentConfirmationBody(
                bateaux.getProprietaire().getName(), // or any owner name you have
                reservationId,
                paymentAmount,
                bateaux,
                date,
                numberOfPersons,
                true,  // isForOwner
                toEmailClient,
                clientPhone
        );
        ownerHelper.setText(ownerHtmlContent, true);

        mailSender.send(ownerMessage);
    }

    @Override
    public void sendReservationConfirmation(
            String toEmail,
            String name, Long reservationId, Double paymentAmount,
            Bateaux bateaux,
            LocalDateTime date, int numberOfPersons
    ) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Reservation Confirmed - Details Inside");

        String htmlContent = generateReservationBody(name, reservationId, paymentAmount, bateaux, date, numberOfPersons);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    @Override
    public String generateReservationBody(String name, Long reservationId, Double paymentAmount,
                                          Bateaux bateaux,
                                          LocalDateTime date, int numberOfPersons) {
        return """
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmation de Réservation</title>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        body {
                            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                            line-height: 1.6;
                            color: #374151;
                            background-color: #f8fafc;
                        }
                        .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background: white;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #1e40af 0%%, #3b82f6 100%%);
                            padding: 40px 30px;
                            text-align: center;
                            color: white;
                        }
                        .logo {
                            width: 120px;
                            height: auto;
                            margin-bottom: 20px;
                        }
                        .header h1 {
                            font-size: 24px;
                            font-weight: 600;
                            margin-bottom: 8px;
                        }
                        .header p {
                            font-size: 16px;
                            opacity: 0.9;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .greeting {
                            font-size: 18px;
                            margin-bottom: 24px;
                            color: #1f2937;
                        }
                        .boat-card {
                            background: #f8fafc;
                            border: 1px solid #e5e7eb;
                            border-radius: 8px;
                            padding: 20px;
                            margin: 24px 0;
                            display: flex;
                            align-items: center;
                            gap: 16px;
                        }
                        .boat-image {
                            width: 80px;
                            height: 60px;
                            border-radius: 6px;
                            object-fit: cover;
                            flex-shrink: 0;
                        }
                        .boat-info h3 {
                            font-size: 18px;
                            font-weight: 600;
                            color: #1e40af;
                            margin-bottom: 4px;
                        }
                        .boat-info p {
                            font-size: 14px;
                            color: #6b7280;
                        }
                        .details-table {
                            width: 100%%;
                            border-collapse: collapse;
                            margin: 24px 0;
                            background: white;
                            border: 1px solid #e5e7eb;
                            border-radius: 8px;
                            overflow: hidden;
                        }
                        .details-table th {
                            background: #f9fafb;
                            padding: 16px;
                            text-align: left;
                            font-weight: 600;
                            color: #374151;
                            border-bottom: 1px solid #e5e7eb;
                        }
                        .details-table td {
                            padding: 16px;
                            border-bottom: 1px solid #f3f4f6;
                        }
                        .details-table tr:last-child td {
                            border-bottom: none;
                        }
                        .label {
                            font-weight: 500;
                            color: #6b7280;
                            width: 40%%;
                        }
                        .value {
                            color: #1f2937;
                            font-weight: 500;
                        }
                        .payment-section {
                            background: #fef3c7;
                            border: 1px solid #fbbf24;
                            border-radius: 8px;
                            padding: 24px;
                            margin: 32px 0;
                            text-align: center;
                        }
                        .payment-amount {
                            font-size: 28px;
                            font-weight: 700;
                            color: #92400e;
                            margin: 16px 0;
                        }
                        .payment-button {
                            display: inline-block;
                            background: #0682a1;
                            color: white;
                            padding: 16px 32px;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: 600;
                            font-size: 16px;
                            margin: 20px 0 16px 0;
                            transition: transform 0.2s ease;
                        }
                        .payment-button:hover {
                            transform: translateY(-1px);
                        }
                        .status-pending {
                            display: inline-block;
                            background: #fef2f2;
                            color: #dc2626;
                            padding: 6px 12px;
                            border-radius: 16px;
                            font-size: 12px;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            border: 1px solid #fecaca;
                        }
                        .footer {
                            background: #f9fafb;
                            padding: 24px 30px;
                            text-align: center;
                            border-top: 1px solid #e5e7eb;
                            color: #6b7280;
                            font-size: 14px;
                        }
                        .footer strong {
                            color: #374151;
                        }
                        .divider {
                            height: 1px;
                            background: #e5e7eb;
                            margin: 32px 0;
                        }
                        @media (max-width: 600px) {
                            .container {
                                margin: 20px;
                                border-radius: 8px;
                            }
                            .content {
                                padding: 24px 20px;
                            }
                            .header {
                                padding: 24px 20px;
                            }
                            .boat-card {
                                flex-direction: column;
                                text-align: center;
                            }
                            .details-table th,
                            .details-table td {
                                padding: 12px;
                            }
                            .payment-section {
                                padding: 20px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <!-- Header -->
                        <div class="header">
                            <img src="https://tuniboat.com/wp-content/uploads/2020/06/logo_final_bas.png" alt="AfricaBoat" class="logo">
                            <h1>Réservation Confirmée</h1>
                            <p>Votre aventure maritime vous attend</p>
                        </div>
                            
                        <!-- Content -->
                        <div class="content">
                            <div class="greeting">
                                Bonjour <strong>%s</strong>,
                            </div>
                            
                            <p>Votre réservation a été confirmée avec succès. Voici les détails de votre location :</p>
                            
                            <!-- Boat Information -->
                            <div class="boat-card">
                                <img src="%s" alt="%s" class="boat-image">
                                <div class="boat-info">
                                    <h3>%s</h3>
                                    <p>%s</p>
                                </div>
                            </div>
                            
                            <!-- Reservation Details -->
                            <table class="details-table">
                                <thead>
                                    <tr>
                                        <th colspan="2">Détails de la Réservation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="label">Réservation</td>
                                        <td class="value">#%s</td>
                                    </tr>
                                    <tr>
                                        <td class="label">Date</td>
                                        <td class="value">%s </td>
                                    </tr>
                                    <tr>
                                        <td class="label">Port de départ</td>
                                        <td class="value">%s</td>
                                    </tr>
                                    <tr>
                                        <td class="label">Passagers</td>
                                        <td class="value">%s personnes</td>
                                    </tr>
                                    <tr>
                                        <td class="label">Statut</td>
                                        <td class="value"><span class="status-pending">En attente de paiement</span></td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <div class="divider"></div>
                            
                            <!-- Payment Section -->
                            <div class="payment-section">
                                <h3 style="margin-bottom: 8px; color: #92400e;">Finaliser votre réservation</h3>
                                <p style="margin-bottom: 16px; color: #92400e;">Montant à régler :</p>
                                <div class="payment-amount">%.2f TND</div>
                                
                                <a href="http://localhost:4200/paiment-details/%s" class="payment-button">
                                    Procéder au Paiement
                                </a>
                                
                                <p style="font-size: 14px; color: #92400e; margin: 0;">
                                    Paiement sécurisé • Confirmation immédiate
                                </p>
                            </div>
                            
                            <p style="margin-top: 32px;">
                                Notre équipe reste à votre disposition pour toute question.<br>
                                Nous avons hâte de vous accueillir !
                            </p>
                            
                            <p style="margin-top: 24px;">
                                Cordialement,<br>
                                <strong>L'équipe AfricaBoat</strong>
                            </p>
                        </div>
                            
                        <!-- Footer -->
                        <div class="footer">
                            <p><strong>AfricaBoat</strong></p>
                            <p>contact@africaboat.tn • +216 70 123 456</p>
                            <p style="margin-top: 12px; font-size: 12px;">
                                © 2024 AfricaBoat. Tous droits réservés.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(
                name,                    // Customer name
                bateaux.getImages().get(0),              // Boat image URL
                bateaux.getNom(),               // Boat image alt
                bateaux.getNom(),               // Boat name
                bateaux.getCarecteristique().getType(),               // Boat type
                reservationId,          // Reservation ID
                date,              // Start date
                bateaux.getPort().getNom(),                   // Port
                numberOfPersons,        // Number of persons
                paymentAmount,          // Payment amount
                reservationId
        );
    }
    @Override
    public String generatePaymentConfirmationBody(
            String name,                   // recipient name (client or owner)
            Long reservationId,
            Double paymentAmount,
            Bateaux bateaux,
            LocalDateTime date,
            int numberOfPersons,
            boolean isForOwner,           // to personalize
            String clientEmail,
            String clientPhone
    ) {
        String greeting = isForOwner
                ? "Cher(e) partenaire <strong>" + name + "</strong>,"
                : "Bonjour <strong>" + name + "</strong>,";

        String message = isForOwner
                ? """
                Un paiement a été confirmé pour l'une de vos réservations. Voici les détails :
              """
                : """
                Nous vous confirmons la réception de votre paiement. Votre réservation est maintenant complète.
              """;

        String contactBlock = isForOwner
                ? """
                <div style="margin-top: 24px;">
                    <h4 style="color: #1f2937;">Coordonnées du client :</h4>
                    <p><strong>Email :</strong> %s</p>
                    <p><strong>Téléphone :</strong> %s</p>
                </div>
              """.formatted(clientEmail, clientPhone)
                : "";

        return """
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Paiement Confirmé</title>
            <style>
                body {
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    background-color: #f8fafc;
                    color: #374151;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background: linear-gradient(135deg, #059669 0%%, #10b981 100%%);
                    padding: 40px 30px;
                    text-align: center;
                    color: white;
                }
                .logo {
                    width: 120px;
                    margin-bottom: 20px;
                }
                .header h1 {
                    font-size: 24px;
                    font-weight: 600;
                }
                .content {
                    padding: 40px 30px;
                }
                .greeting {
                    font-size: 18px;
                    margin-bottom: 20px;
                }
                .boat-card {
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 24px 0;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .boat-image {
                    width: 80px;
                    height: 60px;
                    border-radius: 6px;
                    object-fit: cover;
                }
                .boat-info h3 {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e40af;
                }
                .boat-info p {
                    font-size: 14px;
                    color: #6b7280;
                }
                .details-table {
                    width: 100%%;
                    border-collapse: collapse;
                    margin-top: 24px;
                }
                .details-table th, .details-table td {
                    padding: 16px;
                    border-bottom: 1px solid #e5e7eb;
                    text-align: left;
                }
                .status-paid {
                    background: #ecfdf5;
                    color: #059669;
                    padding: 6px 12px;
                    border-radius: 16px;
                    font-size: 12px;
                    font-weight: 600;
                    border: 1px solid #a7f3d0;
                }
                .payment-section {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    border-radius: 8px;
                    padding: 24px;
                    text-align: center;
                    margin: 32px 0;
                }
                .payment-amount {
                    font-size: 26px;
                    font-weight: 700;
                    color: #065f46;
                    margin: 12px 0;
                }
                .footer {
                    background: #f9fafb;
                    padding: 24px 30px;
                    text-align: center;
                    border-top: 1px solid #e5e7eb;
                    font-size: 14px;
                    color: #6b7280;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://tuniboat.com/wp-content/uploads/2020/06/logo_final_bas.png" alt="AfricaBoat" class="logo">
                    <h1>Paiement Confirmé</h1>
                    <p>Merci pour votre confiance</p>
                </div>

                <div class="content">
                    <p class="greeting">%s</p>
                    <p>%s</p>

                    <div class="boat-card">
                        <img src="%s" alt="%s" class="boat-image">
                        <div class="boat-info">
                            <h3>%s</h3>
                            <p>%s</p>
                        </div>
                    </div>

                    <table class="details-table">
                        <tr>
                            <th>Réservation</th>
                            <td>#%s</td>
                        </tr>
                        <tr>
                            <th>Date</th>
                            <td>%s</td>
                        </tr>
                        <tr>
                            <th>Port de départ</th>
                            <td>%s</td>
                        </tr>
                        <tr>
                            <th>Passagers</th>
                            <td>%d personnes</td>
                        </tr>
                        <tr>
                            <th>Statut</th>
                            <td><span class="status-paid">Payée</span></td>
                        </tr>
                    </table>

                    <div class="payment-section">
                        <p>Montant payé :</p>
                        <div class="payment-amount">%.2f TND</div>
                        <p>Paiement reçu avec succès.</p>
                    </div>

                    %s

                    <p>Nous avons hâte de vous accueillir à bord !</p>
                    <p>Cordialement,<br><strong>L'équipe AfricaBoat</strong></p>
                </div>

                <div class="footer">
                    <p><strong>AfricaBoat</strong></p>
                    <p>contact@africaboat.tn • +216 70 123 456</p>
                    <p style="font-size: 12px;">© 2024 AfricaBoat. Tous droits réservés.</p>
                </div>
            </div>
        </body>
        </html>
    """.formatted(
                greeting,
                message,
                bateaux.getImages().get(0),
                bateaux.getNom(),
                bateaux.getNom(),
                bateaux.getCarecteristique().getType(),
                reservationId,
                date,
                bateaux.getPort().getNom(),
                numberOfPersons,
                paymentAmount,
                contactBlock
        );
    }

}


