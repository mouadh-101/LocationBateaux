import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { Reservation, ReservationStatus } from '../../interfaces/reservation';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private fb: FormBuilder
  ) { 
    this.modifyForm = this.fb.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    });
  }

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

  getDurationInDays(): number {
    if (!this.reservation) return 0;
  
    const dateDebut = new Date(this.reservation.dateDebut);
    const dateFin = new Date(this.reservation.dateFin);
  
    const diffTime = Math.abs(dateFin.getTime() - dateDebut.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getBoatTotal(): number {
    if (!this.reservation) return 0;
    return this.getDurationInDays() * this.reservation.bateau.prix;
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
      dateDebut: this.reservation?.dateDebut,
      dateFin: this.reservation?.dateFin
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
          alert('Réservation annulée avec succès');
        },
        error: () => {
          this.isProcessing = false;
          alert('Erreur lors de l\'annulation');
        }
      });
  }
  confirmModify() {
    if (this.modifyForm.invalid || !this.reservation) return;

    this.isProcessing = true;
    this.reservation.dateDebut = this.modifyForm.value.dateDebut;
    this.reservation.dateFin = this.modifyForm.value.dateFin;


    this.reservationService.updateReservation(this.reservation.reservationId, this.reservation)
      .subscribe({
        next: (res) => {
          this.reservation = res;
          this.showModifyModal = false;
          this.isProcessing = false;
        },
        error: () => {
          this.isProcessing = false;
          alert('Erreur lors de la mise à jour.');
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

  downloadInvoice() {
    // Simulate invoice download
    console.log('Téléchargement de la facture...');
    alert('Téléchargement de la facture (à implémenter)');
  }

  contactSupport() {
    console.log('Contact du support...');
    alert('Redirection vers le support (à implémenter)');
  }
  calculateTax(): number {
    if (!this.reservation) return 0;
    const total = this.getBoatTotal();
    const taxRate = 0.2;
    return Math.round(total * taxRate * 100) / 100;
  }
  calculateTotalWithTax(): number {
    return Math.round((this.getBoatTotal() + this.calculateTax())*100)/100;
  }
}