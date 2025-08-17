import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Reservation } from 'src/app/interfaces/reservation';
import { ReservationService } from 'src/app/services/reservation.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reservation-details-admin',
  templateUrl: './reservation-details-admin.component.html',
  styleUrls: ['./reservation-details-admin.component.css']
})
export class ReservationDetailsAdminComponent implements OnInit {

  reservation: Reservation | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.loadReservation(id);
    } else {
      this.error = 'No reservation ID provided';
    }
  }

  loadReservation(id: number) {
    this.loading = true;
    this.reservationService.getReservationById(id).subscribe({
      next: (res) => {
        this.reservation = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load reservation details';
        this.loading = false;
      }
    });
  }

    goBack(): void {
    this.location.back();
  }
}
