import { Component, OnInit } from '@angular/core';
import { BoatService } from '../../services/boats.service';
import { UserService } from '../../services/user.service';
import { ReservationService } from '../../services/reservation.service';
import { Boat } from '../../interfaces/boats';
import { User } from '../../interfaces/user';


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

  constructor(
    private boatService: BoatService,
    private userService: UserService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // 🔵 Récupération des bateaux
    this.boatService.getAllBoats().subscribe({
      next: (boats: Boat[]) => {
        this.totalBoats = boats.length;
        this.availableBoats = boats.filter(b => b.disponible).length;
        this.unavailableBoats = this.totalBoats - this.availableBoats;
      },
      error: (err) => {
        console.error("Erreur récupération bateaux :", err);
      }
    });

    // 🟢 Récupération des utilisateurs
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.totalUsers = users.length;
        this.activeUsers = users.filter(u => u.isActive).length;
        this.bannedUsers = users.filter(u => !u.isActive).length;
      },
      error: (err) => {
        console.error("Erreur récupération utilisateurs :", err);
      }
    });

    // 🟠 Récupération des réservations
   // this.reservationService.getAllReservations().subscribe({
     // next: (reservations: Reservation[]) => {
     //   this.totalReservations = reservations.length;
    //  },
    //  error: (err) => {
     //   console.error("Erreur récupération réservations :", err);
    //  }
   // });
  }
}
