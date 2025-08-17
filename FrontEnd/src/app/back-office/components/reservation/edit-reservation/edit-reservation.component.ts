import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservation.service';
import { Reservation } from 'src/app/interfaces/reservation';

@Component({
  selector: 'app-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.css']
})
export class EditReservationComponent implements OnInit {

  editForm!: FormGroup;
  reservationId!: number;
  error: string = '';
  originalReservation!: Reservation;

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
      bateauNom: [{ value: '', disabled: true }, Validators.required],
      date: [{ value: '', disabled: true }, Validators.required],
      typeReservation: [{ value: '', disabled: true }, Validators.required],
      status: ['', Validators.required]
    });
  }

  loadReservation(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (res: Reservation) => {
        this.originalReservation = res;

        this.editForm.patchValue({
          bateauNom: res.bateau.nom,
          date: this.formatDateForInput(res.date),
          typeReservation: res.typeReservation,
          status: res.status
        });
      },
      error: () => {
        this.error = "Erreur lors du chargement de la réservation.";
      }
    });
  }

  formatDateForInput(date: string | Date): string {
    const d = (date instanceof Date) ? date : new Date(date);
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  onSubmit(): void {
    if (this.editForm.invalid || !this.originalReservation) {
      this.editForm.markAllAsTouched();
      return;
    }

    const formValues = this.editForm.getRawValue();

    const updatedReservation: Reservation = {
      ...this.originalReservation,
      status: formValues.status,
      date: (this.originalReservation.date instanceof Date) ? this.originalReservation.date : new Date(this.originalReservation.date)
    };

    this.reservationService.updateReservation(this.reservationId, updatedReservation).subscribe({
      next: () => {
        this.router.navigate(['/admin/reservations']);
      },
      error: () => {
        this.error = "Erreur lors de la mise à jour.";
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/reservations']);
  }
}
