import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Reservation } from 'src/app/interfaces/reservation';
import { ReservationService } from 'src/app/services/reservation.service';

interface FilterOption {
  value: string;
  label: string;
  count: number;
}
@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css']
})
export class MyReservationsComponent {
  reservations: Reservation[] = [];
  loading: boolean = true;
  filteredReservations: Reservation[] = [];
  activeFilter = 'all';

  filterOptions: FilterOption[] = [
    { value: 'all', label: 'Toutes', count: 0 },
    { value: 'EN_ATTENTE', label: 'En Attente', count: 0 },
    { value: 'ACCEPTER', label: 'Accepter', count: 0 },
    { value: 'REFUSER', label: 'Refuser', count: 0 },
  ];

  constructor(
    public router: Router,
    private reservationService: ReservationService
  ) { }

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    this.reservationService.myReservations().subscribe(reservations => {
      this.reservations = reservations;
      this.filteredReservations = [...this.reservations];
      this.updateFilterCounts();

      this.loading = false;
    });


  }

  updateFilterCounts() {
    this.filterOptions.forEach(option => {
      if (option.value === 'all') {
        option.count = this.reservations.length;
      } else {
        option.count = this.reservations.filter(r => r.status === option.value).length;
      }
    });
  }

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter() {
    if (this.activeFilter === 'all') {
      this.filteredReservations = [...this.reservations];
    } else {
      this.filteredReservations = this.reservations.filter(r => r.status === this.activeFilter);
    }
  }

  getFilterLabel(filter: string): string {
    const option = this.filterOptions.find(opt => opt.value === filter);
    return option ? option.label : filter;
  }

  countByStatus(status: string): number {
    return this.reservations.filter(r => r.status === status).length;
  }



  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'pending': 'En Attente',
      'confirmed': 'Confirmée',
      'in-progress': 'En Cours',
      'completed': 'Terminée',
      'cancelled': 'Annulée'
    };
    return statusLabels[status] || status;
  }

  

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
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

  goToDetails(reservationId: number) {
    this.router.navigate(['/reservation-details', reservationId]);
  }

  goToBoatDetails(boatId: number) {
    this.router.navigate(['/boat-details', boatId]);
  }



  trackByReservationId(index: number, reservation: Reservation): number {
    return reservation.reservationId;
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'EN_ATTENTE': 'bg-yellow-100 text-yellow-800',
      'ACCEPTER': 'bg-green-100 text-green-800',
      'REFUSER': 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusDotClass(status: string): string {
    const statusDotClasses: { [key: string]: string } = {
      'EN_ATTENTE': 'bg-yellow-500',
      'ACCEPTER': 'bg-green-500',
      'REFUSER': 'bg-red-500'
    };
    return statusDotClasses[status] || 'bg-gray-500';
  }

}