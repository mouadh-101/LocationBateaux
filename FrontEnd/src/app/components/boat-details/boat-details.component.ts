import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Avis, Boat, BoatFilter } from 'src/app/interfaces/boat';
import { AlertService } from 'src/app/services/alert.service';
import { AuthModalService } from 'src/app/services/auth-modal.service';
import { AuthService } from 'src/app/services/auth.service';
import { AvisService } from 'src/app/services/avis.service';
import { BoatService } from 'src/app/services/boat.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { dateNotPastValidator, dateRangeValidator, noOverlapValidator } from 'src/app/validators/validatorReservation';


@Component({
  selector: 'app-boat-details',
  templateUrl: './boat-details.component.html',
  styleUrls: ['./boat-details.component.css']
})
export class BoatDetailsComponent {
  boat: Boat | null = null;
  loading = true;
  reservationForm: FormGroup
  isLoggedIn: boolean = false;
  searchDetails!: BoatFilter | null;




  constructor(private boatService: BoatService, public router: Router, public route: ActivatedRoute, private fb: FormBuilder, private authService: AuthService, private avisService: AvisService, private authModalService: AuthModalService, private reservationService: ReservationService, private alertService: AlertService) {
    this.reservationForm = this.fb.group({
      dateDebut: [new Date().toISOString().slice(0, 10), [Validators.required, dateNotPastValidator()]],
      dateFin: [new Date().toISOString().slice(0, 10), [Validators.required, dateNotPastValidator()]],
      nbPersonnes: [1, [Validators.required, Validators.min(1)]],
    }, {
      validators: [dateRangeValidator('dateDebut', 'dateFin'), noOverlapValidator(this.boat?.reservations || [])]
    });


  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      const boatId = +params['id'];
      this.loadBoatDetails(boatId);
      this.loadSearchDetails();
    });
    this.authService.authState$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

  }
  loadBoatDetails(batauxId: number) {
    this.boatService.getBateuxById(batauxId).subscribe({
      next: (data: Boat) => {
        this.boat = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching boat details:', err);
        this.loading = false;
      }
    });
  }
  loadSearchDetails() {
    const state = history.state;
    if (state && state.searchDetails) {
      this.searchDetails = state.searchDetails as BoatFilter;
      this.reservationForm.patchValue({
        dateDebut: this.searchDetails.dateDebut || new Date().toISOString().slice(0, 10),
        dateFin: this.searchDetails.dateFin || new Date().toISOString().slice(0, 10),
        nbPersonnes: this.searchDetails.nbPersonnes || 1
      });
      console.log('Search details loaded:', this.searchDetails);
    } else {
      this.searchDetails = null;
      console.log('No search details found in state');
    }
  }
  onReserve() {
    if (!this.authService.isLoggedIn()) {
      this.authModalService.open();
      return;
    }

    if (this.reservationForm.invalid || !this.boat) {
      this.alertService.showAlert('Veuillez remplir tous les champs correctement.', 'error');
      return;
    }

    const newReservation = {
      dateDebut: this.reservationForm.value.dateDebut,
      dateFin: this.reservationForm.value.dateFin,
      nbPersonnes: this.reservationForm.value.nbPersonnes,
    };

    this.reservationService.addReservation(newReservation, this.boat.bateauxId).subscribe({
      next: (reservation) => {
        this.alertService.showAlert('Réservation effectuée avec succès.', 'success');
        this.router.navigate(['/reservation-details', reservation.reservationId]);
      },
      error: (err) => {
        this.alertService.showAlert(err.message, 'error');
      }
    });
  }

  getBoatRating(boat: Boat): number {
    if (!boat.avis || boat.avis.length === 0) {
      return 0; // ou une valeur par défaut (ex: 3)
    }
    const total = boat.avis.reduce((sum, avis) => sum + avis.note, 0);
    const average = total / boat.avis.length;
    return Math.round(average);
  }
  calculateTotalPrice(startDate: Date, endDate: Date, pricePerDay: number, nbPersonnes: number): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

    return daysDiff > 0 ? daysDiff * pricePerDay * nbPersonnes : 0; // Ensure positive days
  }
  calculateDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
    return daysDiff > 0 ? daysDiff : 0; // Ensure positive days
  }
  decrementNbPersonnes() {
    const current = this.reservationForm.get('nbPersonnes')?.value || 1;
    this.reservationForm.get('nbPersonnes')?.setValue(Math.max(1, current - 1));
  }
  incrementNbPersonnes() {
    const current = this.reservationForm.get('nbPersonnes')?.value || 1;
    this.reservationForm.get('nbPersonnes')?.setValue(current + 1);
  }



}
