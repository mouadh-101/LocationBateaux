import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddBoatComponent } from './components/boats/add-boats/add-boats.component';
import { EditBoatComponent } from './components/boats/edit-boats/edit-boats.component';
import { ListBoatsComponent } from './components/boats/list-boats/list-boats.component';
import { EditReservationComponent } from './components/reservation/edit-reservation/edit-reservation.component';
import { ReservationsListComponent } from './components/reservation/list-reservation/list-reservation.component';
import { UserListComponent } from './components/user/list-user/list-user.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ListPartnersComponent } from './components/partner/list-partner/list-partner.component';
import { AddPartnerComponent } from './components/partner/add-partner/add-partner.component';
import { EditPartnerComponent } from './components/partner/edit-partner/edit-partner.component';
import { HistoriquePaiementComponent } from './components/payment-history/payment-history.component';
import { AddUserComponent } from './components/user/add-user/add-user.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../interceptor/auth.interceptor';
import { DetailsBoatsAdminComponent } from './components/boats/details-boats-admin/details-boats-admin.component';
import { ReservationDetailsAdminComponent } from './components/reservation/reservation-details-admin/reservation-details-admin.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BackLayoutComponent } from './layouts/back-layout/back-layout.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DashboardComponent,
    AddBoatComponent,
    EditBoatComponent,
    ListBoatsComponent,
    EditReservationComponent,
    ReservationsListComponent,
    UserListComponent,
    EditUserComponent,
    ProfileComponent,
    EditProfileComponent,
    ImageUploadComponent,
    DetailsBoatsAdminComponent,
    ListPartnersComponent,
    AddPartnerComponent,
    EditPartnerComponent,
    ReservationDetailsAdminComponent,
    HistoriquePaiementComponent,
    AddUserComponent,
    BackLayoutComponent
  ],
  imports: [
    CommonModule,
    BackOfficeRoutingModule,
    SharedModule
    

  ],
  
})
export class BackOfficeModule { }
