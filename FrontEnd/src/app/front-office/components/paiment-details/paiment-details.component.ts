import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { Paiment } from 'src/app/interfaces/paiment';
import { AlertService } from 'src/app/services/alert.service';
import { ContactUsService } from 'src/app/services/contact-us.service';
import { PaiementService } from 'src/app/services/paiement.service';

@Component({
  selector: 'app-paiment-details',
  templateUrl: './paiment-details.component.html',
  styleUrls: ['./paiment-details.component.css']
})
export class PaimentDetailsComponent {
  paiment: Paiment | null = null;
  stripePromise = loadStripe('pk_test_51RmZqr2S6seGBtvDOh7CA8bMLqEbKy80ZnN4OxSW87ivV8ET14ztASbGUPQcV4PgdQyuErxKVHozc0Cd6hwiCeLZ00IC8ghReY');
  loading = true;
  showPaymentModal = false;



  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private paimentService: PaiementService,
    private alertService: AlertService,
    private contactUsService: ContactUsService
  ) { }
  ngOnInit() {
    this.route.params.subscribe(params => {
      const paimentId = +params['id'];
      this.route.queryParams.subscribe(queryParams => {
        const shouldConfirmClickToPay = queryParams['success'] === 'true';
        this.paimentService.getPaimentsById(paimentId).subscribe(paiment => {
          this.paiment = paiment;
          this.loading = false;

          if (shouldConfirmClickToPay && this.paiment?.status === 'EN_ATTENTE' && this.paiment?.methode === null) {
            this.confirmClickToPay(paimentId);
          }
        });
      });
    });
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }
  formatDateShort(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  }
  goToReservationDetails() {
    if (this.paiment) {
      this.router.navigate(['/reservation-details', this.paiment.reservation.reservationId]);
    }
  }
  goToBoatDetails() {
    if (this.paiment) {
      this.router.navigate(['/boat-details', this.paiment.reservation.bateau.bateauxId]);
    }
  }
  
  selectPaymentMethod(method: 'PAYPAL' | 'CLICKTOPAY') {
    this.showPaymentModal = false;
    if (!this.paiment) return;

    if (method === 'PAYPAL') {
      this.paimentService.createPaypalOrder(this.paiment.paiementId).subscribe({
        next: res => {
          localStorage.setItem('method', 'PAYPAL');
          window.location.href = res.approvalUrl;
        },
        error: err => {
          console.error("Erreur création commande PayPal", err);
        }
      });
    }

    if (method === 'CLICKTOPAY') {
      this.paimentService.createStripeSession(this.paiment.paiementId).subscribe({
        next: (result) => {
          this.stripePromise.then(stripe => {
            if (!stripe) {
              this.alertService.showAlert("Stripe n'a pas été chargé correctement.", "error")
              return;
            }
            localStorage.setItem('method', 'CLICKTOPAY');
            stripe.redirectToCheckout({
              sessionId: result.sessionId
            }).then(res => {
              if (res.error) {
                console.error('Erreur Stripe:', res.error.message);
                this.alertService.showAlert('Erreur lors de la redirection Stripe: ' + res.error.message, "error")
              }
            });
          });
        },
        error: (err) => {
          console.error('Erreur lors de la création de la session Stripe:', err);
          this.alertService.showAlert('Impossible de créer la session de paiement Stripe.', "error")

        }
      });
    }

  }
  confirmClickToPay(paimentId: number) {

    if (this.paiment) {
      const storedMethod = localStorage.getItem('method');
      if (storedMethod) {
        this.paiment.methode = storedMethod;
        localStorage.removeItem('method')
      }
      this.paiment.status = 'ACCEPTER';
      this.paimentService.updatePaiment(paimentId, this.paiment).subscribe({
        next: (updated) => {
          this.paiment = updated;
          this.alertService.showAlert('Paiement Click to Pay confirmé.', 'success')
        },
        error: err => {
          console.error("Erreur mise à jour Click to Pay:", err);
          this.alertService.showAlert("Erreur mise à jour Click to Pay:" + err, 'error')
        }
      });
    }
  }
  openContactUs() {
    this.contactUsService.open();
  }






}
