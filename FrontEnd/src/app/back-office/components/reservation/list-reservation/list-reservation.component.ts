import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'src/app/services/reservation.service';
import { Reservation } from 'src/app/interfaces/reservation';
import { Router } from '@angular/router';
import { Boat } from 'src/app/interfaces/boat';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reservations-list',
  templateUrl: './list-reservation.component.html',
  styleUrls: ['./list-reservation.component.css']
})
export class ReservationsListComponent implements OnInit {

  reservations: Reservation[] = [];
  filtered: Reservation[] = [];
  currentFilter: string = 'ALL';

  // Filtres
  clientFilter: string = '';
  boatFilter: string = '';
  dateFilter: string = '';

  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    if (this.authService.isGestionnaire()) {
      this.reservationService.getReservationsForGestionnaire().subscribe(res => {
        this.reservations = res;
        this.applyFilter(this.currentFilter);
      });
    }

    if (this.authService.isAdmin()) {
      this.reservationService.getAllReservations().subscribe(res => {
        this.reservations = res;
        this.applyFilter(this.currentFilter);
      });
    }
  }

  applyFilter(filter: string): void {
    this.currentFilter = filter;
    let filtered = this.reservations;

    // Statut
    if (filter !== 'ALL') {
      filtered = filtered.filter(r => r.status === filter);
    }

    // Nom du client
    if (this.clientFilter.trim()) {
      filtered = filtered.filter(r =>
        r.utilisateur?.name?.toLowerCase().includes(this.clientFilter.trim().toLowerCase())
      );
    }

    // Nom du bateau
    if (this.boatFilter.trim()) {
      filtered = filtered.filter(r =>
        r.bateau?.nom?.toLowerCase().includes(this.boatFilter.trim().toLowerCase())
      );
    }

    // Date
    if (this.dateFilter) {
      const selectedDate = new Date(this.dateFilter).toISOString().split('T')[0]; // 'YYYY-MM-DD'
      filtered = filtered.filter(r =>
        new Date(r.date).toISOString().startsWith(selectedDate)
      );
    }

    this.filtered = filtered;
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
  viewReservation(reservation: Reservation): void {
    this.router.navigate(['/admin/reservation-details', reservation.reservationId]);
  }

  editReservation(reservation: Reservation): void {
    this.router.navigate(['/admin/reservations/edit', reservation.reservationId]);
  }

  viewBoat(boat: Boat): void {
    this.router.navigate(['/admin/boat-details', boat.bateauxId]);
  }
}
