import { Component, OnInit } from '@angular/core';
import { BoatService } from 'src/app/services/boat.service';
import { UserService } from 'src/app/services/user.service';
import { PartnerService } from 'src/app/services/partner.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalBoats: number = 0;
  availableBoats: number = 0;
  unavailableBoats: number = 0;

  totalUsers: number = 0;
  activeUsers: number = 0;
  bannedUsers: number = 0;

  totalReservations: number = 0;

  totalPartners: number = 0;
  pendingReservations: number = 0;
  acceptedReservations: number = 0;
  refusedReservations: number = 0;

  constructor(
    private boatService: BoatService,
    private userService: UserService,
    private partnerService: PartnerService,
    private reservationService: ReservationService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.boatService.getBoats().subscribe({
      next: boats => {
        this.totalBoats = boats.length;
        this.availableBoats = boats.filter(b => b.disponible).length;
        this.unavailableBoats = this.totalBoats - this.availableBoats;
      },
      error: err => {
        console.error("Erreur récupération bateaux :", err);
      }
    });

    this.userService.getAllUsers().subscribe({
      next: users => {
        this.totalUsers = users.length;
        this.activeUsers = users.filter(u => u.isActive).length;
        this.bannedUsers = users.filter(u => !u.isActive).length;
      },
      error: err => {
        console.error("Erreur récupération utilisateurs :", err);
      }
    });

    this.reservationService.getAllReservations().subscribe({
      next: reservations => {
        this.totalReservations = reservations.length;
        this.pendingReservations = reservations.filter(r => r.status === 'EN_ATTENTE').length;
        this.acceptedReservations = reservations.filter(r => r.status === 'ACCEPTER').length;
        this.refusedReservations = reservations.filter(r => r.status === 'REFUSER').length;


      },
      error: err => {
        console.error("Erreur récupération réservations :", err);
      }
    });

    this.partnerService.getPartners().subscribe({
      next: partners => {
        this.totalPartners = partners.length;
      },
      error: err => {
        console.error("Erreur récupération partenaires :", err);
      }
    });
  }
}
