import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservation.service';
import { ReservationData } from 'src/app/interfaces/reservation-data';

@Component({
  selector: 'app-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.css']
})
export class EditReservationComponent implements OnInit {

  editForm!: FormGroup;
  reservationId!: number;
  error: string = '';
  originalReservation!: ReservationData;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reservationId = Number(this.route.snapshot.paramMap.get('id'));
    this.buildForm();
    this.loadReservation();
  }

  buildForm(): void {
    this.editForm = this.fb.group({
      bateauNom: ['', Validators.required],
      date: ['', Validators.required],
      typeReservation: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  loadReservation(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (res: ReservationData) => {
        this.originalReservation = res;

        this.editForm.patchValue({
          bateauNom: res.bateau.nom,
          date: this.formatDateForInput(res.date),
          typeReservation: res.typeReservation,
          status: res.status
        });

        // Désactivation des champs non modifiables
        this.editForm.controls['bateauNom'].disable();
        this.editForm.controls['date'].disable();
        this.editForm.controls['typeReservation'].disable();
        // status reste activé pour modification
      },
      error: () => {
        this.error = "Erreur lors du chargement de la réservation.";
      }
    });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  onSubmit(): void {
    if (this.editForm.invalid || !this.originalReservation) {
      this.editForm.markAllAsTouched();
      return;
    }

    // Pour récupérer la valeur même des champs désactivés, on utilise getRawValue()
    const formValues = this.editForm.getRawValue();

    const updatedReservation: ReservationData = {
      reservationId: this.reservationId,
      bateau: {
        ...this.originalReservation.bateau,
        nom: formValues.bateauNom // valeur récupérée même si désactivée
      },
      date: new Date(formValues.date).toISOString(),
      typeReservation: formValues.typeReservation,
      status: formValues.status,
      utilisateur: this.originalReservation.utilisateur,
      nbPersonnes: this.originalReservation.nbPersonnes,
      paiement: this.originalReservation.paiement
    };

    this.reservationService.updateReservation(this.reservationId, updatedReservation).subscribe({
      next: () => {
        this.router.navigate(['/reservations']);
      },
      error: () => {
        this.error = "Erreur lors de la mise à jour.";
      }
    });

  }
  public goBack(): void {
  this.router.navigate(['/reservations']);
}
}
