import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontLayoutComponent } from './layouts/front-layout/front-layout.component';
import { BoatListComponent } from './components/boat-list/boat-list.component';
import { BoatDetailsComponent } from './components/boat-details/boat-details.component';
import { AuthGuard } from '../guards/auth.guard';
import { ReservationDetailsComponent } from './components/reservation-details/reservation-details.component';
import { PaimentDetailsComponent } from './components/paiment-details/paiment-details.component';
import { MyReservationsComponent } from './components/my-reservations/my-reservations.component';
import { PaimentListComponent } from './components/paiment-list/paiment-list.component';
import { FavoriteBoatsComponent } from './components/favorite-boats/favorite-boats.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PaypalComponent } from './components/paypal/paypal.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: FrontLayoutComponent,
    children: [
      { path: 'boats', component: BoatListComponent },
      { path: 'boat-details/:id', component: BoatDetailsComponent},
      { path: 'reservation-details/:id', canActivate: [AuthGuard], component: ReservationDetailsComponent },
      { path: 'paiment-details/:id', canActivate: [AuthGuard], component: PaimentDetailsComponent },
      { path: 'my-reservations', canActivate: [AuthGuard], component: MyReservationsComponent },
      { path: 'my-paiments', canActivate: [AuthGuard], component: PaimentListComponent },
      { path: 'favorite', canActivate: [AuthGuard], component: FavoriteBoatsComponent },
      { path: 'profile', canActivate: [AuthGuard], component: UserProfileComponent },
      { path: 'paiment/paypal', canActivate: [AuthGuard], component: PaypalComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: '', component: HomeComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
