import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { BoatListComponent } from './components/boat-list/boat-list.component';
import { BoatDetailsComponent } from './components/boat-details/boat-details.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ReservationDetailsComponent } from './components/reservation-details/reservation-details.component';
import { AuthGuard } from './guards/auth.guard';
import { MyReservationsComponent } from './components/my-reservations/my-reservations.component';
import { FavoriteBoatsComponent } from './components/favorite-boats/favorite-boats.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PaypalComponent } from './components/paypal/paypal.component';
import { PaimentListComponent } from './components/paiment-list/paiment-list.component';
import { PaimentDetailsComponent } from './components/paiment-details/paiment-details.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  { path: 'boats',component:BoatListComponent},
  { path: 'boat-details/:id', component:BoatDetailsComponent},
  { path: 'reservation-details/:id',canActivate:[AuthGuard] ,component: ReservationDetailsComponent},
  { path: 'paiment-details/:id',canActivate:[AuthGuard] ,component: PaimentDetailsComponent},
  { path: 'my-reservations', canActivate:[AuthGuard], component:MyReservationsComponent},
  { path: 'my-paiments', canActivate:[AuthGuard], component:PaimentListComponent},
  { path: 'favorite', canActivate:[AuthGuard], component:FavoriteBoatsComponent},
  { path: 'profile', canActivate:[AuthGuard],component:UserProfileComponent},
  {path : 'paiment/paypal',canActivate:[AuthGuard],component:PaypalComponent},
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', component: HomeComponent },
  { path: '**',component:NotFoundComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
