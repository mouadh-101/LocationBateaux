import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservation.service';
import { Reservation, ReservationStatus } from 'src/app/interfaces/reservation';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { ContactUsService } from 'src/app/services/contact-us.service';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css']
})
export class ReservationDetailsComponent implements OnInit {
  reservation: Reservation | null = null;
  loading = true;
  showCancelModal = false;
  showModifyModal = false;
  isProcessing = false;
  userRole: string | null = null;
  modifyForm: FormGroup;

  
  

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private reservationService: ReservationService,
    private authService: AuthService,
    private fb: FormBuilder,
    private alertService:AlertService,
    private contactUsService: ContactUsService
  ) { 
    this.modifyForm = this.fb.group({
      date: ['', Validators.required],
      typeReservation:['', Validators.required],
      nbPersonnes: [1, [Validators.required, Validators.min(1)]]
    });
  }
  reservationTypes = [
    { label: 'Journée', value: 'JOURNEE', name:"full_day_enabled" },
    { label: 'Demi-journée', value: 'DEMI_JOURNEE', name:"half_day_enabled" },
    { label: '2 heures', value: 'DEUX_HEURES', name:"two_hours_enabled" }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const reservationId = +params['id'];
      this.loadReservationDetails(reservationId);
    });
    this.userRole = this.authService.role;
  }

  loadReservationDetails(id: number) {
    this.loading = true;
    this.reservationService.getReservationById(id).subscribe(
      reservation => {
        this.reservation = reservation;
        this.loading = false;
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

  onCancelReservation() {
    this.showCancelModal = true;
  }

  onModifyReservation() {
    this.modifyForm.patchValue({
      date: this.reservation?.date,
      typeReservation:this.reservation?.typeReservation,
      nbPersonnes: this.reservation?.nbPersonnes || 1
    });
    this.showModifyModal = true;
  }

  confirmCancel() {
    this.isProcessing = true;
    this.reservationService.cancelReservation(this.reservation!.reservationId)
      .subscribe({
        next: () => {
          this.showCancelModal = false;
          this.isProcessing = false;
          this.alertService.showAlert('Réservation annulée avec succès.', 'success');
          this.router.navigate(['/my-reservations']);
        },
        error: () => {
          this.isProcessing = false;
          this.alertService.showAlert('Erreur lors de l\'annulation de la réservation.', 'error');
        }
      });
  }
  confirmModify() {
    if (this.modifyForm.invalid || !this.reservation) return;

    this.isProcessing = true;
    this.reservation.date = this.modifyForm.value.date;
    this.reservation.typeReservation=this.modifyForm.value.typeReservation
    this.reservation.nbPersonnes = this.modifyForm.value.nbPersonnes;


    this.reservationService.updateReservation(this.reservation.reservationId, this.reservation)
      .subscribe({
        next: (res) => {
          this.reservation = res;
          this.showModifyModal = false;
          this.isProcessing = false;
          this.alertService.showAlert('Réservation modifiée avec succès.', 'success');
          this.modifyForm.reset();
        },
        error: () => {
          this.isProcessing = false;
          this.alertService.showAlert('Erreur lors de la modification de la réservation.', 'error');
        }
      });
  }

  closeModal() {
    this.showCancelModal = false;
    this.showModifyModal = false;
  }

  goToBoatDetails() {
    if (this.reservation) {
      this.router.navigate(['/boat-details', this.reservation.bateau.bateauxId]);
    }
  }
  calculateTotalPrice(typeReservation:string): number {
    if(typeReservation=="DEMI_JOURNEE")
      {
        return this.reservation?.bateau.reservationTypeSettings.halfDayPrice ?? 0
      }
      if(typeReservation=="DEUX_HEURES")
        {
          return this.reservation?.bateau.reservationTypeSettings.twoHoursPrice ?? 0
        }
      return this.reservation?.bateau.reservationTypeSettings.fullDayPrice ?? 0
  }
  calculateAvence(commission: number , typeReservation:string){
    if(typeReservation=="DEMI_JOURNEE")
      {
        return ((this.reservation?.bateau.reservationTypeSettings.halfDayPrice ?? 0)* commission)/100
      }
      if(typeReservation=="DEUX_HEURES")
        {
          return ((this.reservation?.bateau.reservationTypeSettings.twoHoursPrice ?? 0)* commission)/100
        }
      return ((this.reservation?.bateau.reservationTypeSettings.fullDayPrice ?? 0) * commission) / 100
  }
  decrementNbPersonnes() {
    const current = this.modifyForm.get('nbPersonnes')?.value || 1;
    this.modifyForm.get('nbPersonnes')?.setValue(Math.max(1, current - 1));
  }
  incrementNbPersonnes() {
    const current = this.modifyForm.get('nbPersonnes')?.value || 1;
    this.modifyForm.get('nbPersonnes')?.setValue(current + 1);
  }
  isReservationTypeEnabled(typeName: string): boolean {
    return !!this.reservation?.bateau?.reservationTypeSettings?.[typeName as keyof typeof this.reservation.bateau.reservationTypeSettings];
  }
  openContactUs() {
    this.contactUsService.open();
  }
  onPay() {
    if (this.reservation && this.reservation.status === 'ACCEPTER') {
      alert(this.reservation.paiementId)
      this.router.navigate(['/paiment-details', this.reservation.paiementId]);
    } else {
      this.alertService.showAlert('La réservation n\'est pas acceptée ou n\'existe pas.', 'error');
    }
  }
}