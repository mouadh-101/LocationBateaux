import { Boat } from './../../../interfaces/boats';
import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'src/app/services/reservation.service';
import { ReservationData } from 'src/app/interfaces/reservation-data';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reservations-list',
  templateUrl: './list-reservation.component.html',
  styleUrls: ['./list-reservation.component.css']
})
export class ReservationsListComponent implements OnInit {

  reservations: ReservationData[] = [];
  filtered: ReservationData[] = [];
  currentFilter: string = 'ALL';

  constructor(private reservationService: ReservationService,private router: Router) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe(res => {
      this.reservations = res;
      this.applyFilter(this.currentFilter);
    });
  }

  applyFilter(filter: string): void {
    this.currentFilter = filter;
    if (filter === 'ALL') {
      this.filtered = this.reservations;
    } else {
      this.filtered = this.reservations.filter(r => r.status === filter);
    }
  }

  get total(): number {
    return this.reservations.length;
  }

  get acceptedCount(): number {
    return this.reservations.filter(r => r.status === 'ACCEPTER').length;
  }

  countByStatus(status: string): number {
    return this.reservations.filter(r => r.status === status).length;
  }

  // Actions boutons
viewReservation(reservation: ReservationData): void {
    this.router.navigate(['/reservation-details', reservation.reservationId]);
  }

editReservation(reservation: ReservationData): void {
  console.log(reservation.reservationId);
  // ou la suite logique, par exemple la navigation
  this.router.navigate(['/reservations/edit', reservation.reservationId]);
}

 viewBoat(boat: Boat): void {
  this.router.navigate(['/boat-details', boat.bateauxId]);
  console.log('Voir bateau:', boat);
}

}
