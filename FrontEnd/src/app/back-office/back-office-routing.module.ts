import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './components/user/add-user/add-user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListBoatsComponent } from './components/boats/list-boats/list-boats.component';
import { AddBoatComponent } from './components/boats/add-boats/add-boats.component';
import { EditBoatComponent } from './components/boats/edit-boats/edit-boats.component';
import { UserListComponent } from './components/user/list-user/list-user.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ListPartnersComponent } from './components/partner/list-partner/list-partner.component';
import { AddPartnerComponent } from './components/partner/add-partner/add-partner.component';
import { EditPartnerComponent } from './components/partner/edit-partner/edit-partner.component';
import { ReservationsListComponent } from './components/reservation/list-reservation/list-reservation.component';
import { EditReservationComponent } from './components/reservation/edit-reservation/edit-reservation.component';
import { HistoriquePaiementComponent } from './components/payment-history/payment-history.component';
import { DetailsBoatsAdminComponent } from './components/boats/details-boats-admin/details-boats-admin.component';
import { ReservationDetailsAdminComponent } from './components/reservation/reservation-details-admin/reservation-details-admin.component';
import { BackLayoutComponent } from './layouts/back-layout/back-layout.component';
import { AuthAdminGuard } from '../guards/authAdmin.guard';

const routes: Routes = [
  {
    path: '',
    component: BackLayoutComponent,
    children: [

      { path: 'dashboard', canActivate: [AuthAdminGuard], component: DashboardComponent },
      { path: 'list', canActivate: [AuthAdminGuard], component: ListBoatsComponent },
      { path: 'add-boat', canActivate: [AuthAdminGuard], component: AddBoatComponent },
      { path: 'edit-boat/:id', canActivate: [AuthAdminGuard], component: EditBoatComponent },
      { path: 'users', canActivate: [AuthAdminGuard], component: UserListComponent },
      { path: 'edit-user/:id', canActivate: [AuthAdminGuard], component: EditUserComponent, data: { roles: ['ADMIN'] } },
      { path: 'profile', canActivate: [AuthAdminGuard], component: ProfileComponent },
      { path: 'edit-profile', canActivate: [AuthAdminGuard], component: EditProfileComponent },
      { path: 'boat-details/:id', canActivate: [AuthAdminGuard], component: DetailsBoatsAdminComponent },
      { path: 'partners',canActivate: [AuthAdminGuard], component: ListPartnersComponent },
      { path: 'partners/add',canActivate: [AuthAdminGuard], component: AddPartnerComponent },
      { path: 'partners/edit/:id',canActivate: [AuthAdminGuard], component: EditPartnerComponent },
      { path: 'reservations',canActivate: [AuthAdminGuard], component: ReservationsListComponent },
      { path: 'reservations/edit/:id',canActivate: [AuthAdminGuard], component: EditReservationComponent },
      { path: 'reservation-details/:id',canActivate: [AuthAdminGuard], component: ReservationDetailsAdminComponent },
      { path: 'paiements',canActivate: [AuthAdminGuard], component: HistoriquePaiementComponent },
      { path: 'users/add',canActivate: [AuthAdminGuard], component: AddUserComponent },
      { path: '', canActivate: [AuthAdminGuard], component: DashboardComponent },
    ],
      

  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule {

}
