import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { BoatListComponent } from './components/boat-list/boat-list.component';
import { BoatDetailsComponent } from './components/boat-details/boat-details.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ReservationDetailsComponent } from './components/reservation-details/reservation-details.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'boats',component:BoatListComponent},
  { path: 'boat-details/:id', component:BoatDetailsComponent},
  { path: 'reservation-details/:id',canActivate:[AuthGuard] ,component: ReservationDetailsComponent},
  { path: '', component: HomeComponent },
  { path: '**',component:NotFoundComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
