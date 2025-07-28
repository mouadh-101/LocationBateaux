package org.nst.bateaux.service.Implimentation;

import com.paypal.http.HttpResponse;
import com.paypal.orders.*;
import lombok.AllArgsConstructor;
import org.nst.bateaux.config.BusinessException;
import org.nst.bateaux.config.PaypalClient;
import org.nst.bateaux.dto.paiement.PaimentData;
import org.nst.bateaux.entity.*;
import org.nst.bateaux.repository.PaiementRepository;
import org.nst.bateaux.repository.ReservationRepository;
import org.nst.bateaux.service.Interface.IMailService;
import org.nst.bateaux.service.Interface.IPaiementService;
import org.nst.bateaux.service.mappers.MapToDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

@Service
@AllArgsConstructor
public class PaiementService implements IPaiementService {

    @Autowired
    PaiementRepository paiementRepository;
    @Autowired
    MapToDto mapToDto;
    @Autowired
    ReservationRepository reservationRepository;
    @Autowired
    private PaypalClient payPalClient;
    @Autowired
    IMailService mailService;

    @Override
    public PaimentData ajouterPaiement(Reservation res) {

        if (res.getPaiement() != null) {
            throw new BusinessException("This reservation already has a payment associated with it.");
        }
        Paiement newPaiement = new Paiement();
        newPaiement.setMontant(calculateFees(res));
        newPaiement.setDatePaiement(LocalDateTime.now());
        newPaiement.setMethode(null);
        newPaiement.setStatus(StatusRes.EN_ATTENTE);
        newPaiement.setReservation(res);

        return mapToDto.mapToPaiementDto(paiementRepository.save(newPaiement));
    }

    @Override
    public void supprimerPaiement(Long id) {
        Paiement paiement = paiementRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Paiement not found with id: " + id));
        paiementRepository.delete(paiement);
    }

    @Override
    public PaimentData updatePaiement(Long id, PaimentData paiement) {
        Paiement existingPaiement = paiementRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Paiement not found with id: " + id));

        existingPaiement.setMontant(paiement.getMontant());
        existingPaiement.setDatePaiement(paiement.getDatePaiement());
        existingPaiement.setMethode(paiement.getMethode());
        existingPaiement.setStatus(paiement.getStatus());
        if(existingPaiement.getStatus()==StatusRes.ACCEPTER)
        {
            try {
                mailService.sendPaiementConfirmation(
                        existingPaiement.getReservation().getUtilisateur().getEmail(),
                        existingPaiement.getReservation().getBateau().getProprietaire().getEmail(),
                        existingPaiement.getReservation().getUtilisateur().getName(),
                        existingPaiement.getReservation().getUtilisateur().getPhone(),
                        existingPaiement.getReservation().getReservationId(),
                        existingPaiement.getMontant(),
                        existingPaiement.getReservation().getBateau(),
                        existingPaiement.getDatePaiement(),
                        existingPaiement.getReservation().getNbPersonnes()
                );
            }
            catch (Exception e) {
                throw new BusinessException("Error sending payment confirmation email: " + e.getMessage());
            }
        }

        return mapToDto.mapToPaiementDto(paiementRepository.save(existingPaiement));
    }

    @Override
    public List<PaimentData> getAll() {
        return paiementRepository.findAll().stream()
                .map(mapToDto::mapToPaiementDto)
                .toList();
    }

    @Override
    public Optional<PaimentData> getPaiementById(Long id) {
        return paiementRepository.findById(id)
                .map(mapToDto::mapToPaiementDto)
                .or(() -> Optional.empty());
    }

    @Override
    public List<PaimentData> getPaimentByUser(Long userId) {
        List<PaimentData> paiments = new ArrayList<>();
        for (Paiement p : paiementRepository.getPaiementByUser(userId)) {
            paiments.add(mapToDto.mapToPaiementDto(p));
        }
        return paiments;
    }

    @Override
    public float calculateFees(Reservation reservation) {
        if (reservation.getTypeReservation() == TypeReservation.DEMI_JOURNEE) {
            return (float) ((reservation.getBateau().getPrix() * 1 / 2) * reservation.getBateau().getCommission()) / 100;
        }
        if (reservation.getTypeReservation() == TypeReservation.DEUX_HEURES) {
            return (float) ((reservation.getBateau().getPrix() * 2 / 24) * reservation.getBateau().getCommission()) / 100;
        }
        return (float) ((reservation.getBateau().getPrix()) * reservation.getBateau().getCommission()) / 100;
    }

    @Override
    public ResponseEntity<Map<String, String>> createStripeSession(Long id) {
        try {
            Paiement paiement = paiementRepository.findById(id).orElseThrow(() -> new BusinessException("paiment not found"));
            Stripe.apiKey = "sk_test_51RmZqr2S6seGBtvDoojTGOCM27eMfPxLUxJVtdQgT88tPHXhFBsXKqy4o8oIZ2lv6VHMkxkiYALukHCVHQqzATBS00Q4vjIbUM";

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:4200/paiment-details/" + id + "?success=true")
                    .setCancelUrl("http://localhost:4200/paiment-details/" + id + "?cancel=true")
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("usd")
                                                    .setUnitAmount((long) (paiement.getMontant() * 100))
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Paiement bateau #" + id)
                                                                    .build())
                                                    .build())
                                    .build())
                    .build();

            Session session = Session.create(params);
            Map<String, String> response = new HashMap<>();
            response.put("sessionId", session.getId());
            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Stripe error: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @Override
    public String createPaypalOrder(Long id) throws IOException {
        Paiement paiement = paiementRepository.findById(id).orElseThrow(() -> new BusinessException("not found"));

        OrderRequest orderRequest = new OrderRequest();
        orderRequest.checkoutPaymentIntent("CAPTURE");

        ApplicationContext context = new ApplicationContext()
                .returnUrl("http://localhost:4200/paiment-details/" + id + "?paypalSuccess=true")
                .cancelUrl("http://localhost:4200/paiment-details/" + id + "?paypalCancel=true");

        AmountWithBreakdown amount = new AmountWithBreakdown()
                .currencyCode("USD")
                .value(String.valueOf(paiement.getMontant()));

        PurchaseUnitRequest purchaseUnit = new PurchaseUnitRequest()
                .amountWithBreakdown(amount)
                .description("Paiement bateau #" + id);

        orderRequest.applicationContext(context).purchaseUnits(Collections.singletonList(purchaseUnit));

        OrdersCreateRequest request = new OrdersCreateRequest().requestBody(orderRequest);
        Order order = payPalClient.client().execute(request).result();

        return order.links().stream()
                .filter(link -> "approve".equals(link.rel()))
                .findFirst()
                .orElseThrow(() -> new BusinessException("No approval link"))
                .href();
    }
    @Override
    public String captureOrder(String orderId) {
        try {
            OrdersCaptureRequest request = new OrdersCaptureRequest(orderId);
            request.requestBody(null); // Required to be null per PayPal SDK

            HttpResponse<Order> response = payPalClient.client().execute(request);
            return response.result().status(); // e.g. COMPLETED
        } catch (IOException e) {
            throw new RuntimeException("Error capturing PayPal order: " + e.getMessage(), e);
        }
    }
}
