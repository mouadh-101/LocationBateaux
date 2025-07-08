import { Component, OnInit } from '@angular/core';
import { BoatService } from '../../services/boats.service';
import { ReservationService } from '../../services/reservation.service';
import { UserService } from '../../services/user.service';
import { Boat } from '../../interfaces/boats';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalBoats: number = 0;
  availableBoats: number = 0;
  unavailableBoats: number = 0;
  totalReservations: number = 0;
  totalUsers: number = 0;

  constructor(
    private boatService: BoatService,
    private reservationService: ReservationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.boatService.getAllBoats().subscribe(boats => {
      this.totalBoats = boats.length;
      this.availableBoats = boats.filter((b: Boat) => b.disponible).length;
      this.unavailableBoats = this.totalBoats - this.availableBoats;
    });



   // this.reservationService.getAllReservations().subscribe(reservations => {
    //  this.totalReservations = reservations.length;
   // });

    this.userService.getAllUsers().subscribe(users => {
      this.totalUsers = users.length;
   });


   
  }


}
