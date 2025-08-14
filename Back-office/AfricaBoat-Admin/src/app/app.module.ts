import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddBoatComponent } from './components/boats/add-boats/add-boats.component';
import { EditBoatComponent } from './components/boats/edit-boats/edit-boats.component';
import { ListBoatsComponent } from './components/boats/list-boats/list-boats.component';

import { EditReservationComponent } from './components/reservation/edit-reservation/edit-reservation.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './components/auth/auth.component';
import { AlertComponent } from 'src/app/alert/alert.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { UserListComponent } from './components/user/list-user/list-user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { CommonModule } from '@angular/common';
import { BoatDetailsComponent } from './components/boats/details-boats/details-boats.component';
import { AddPartnerComponent } from './components/partner/add-partner/add-partner.component';
import { EditPartnerComponent } from './components/partner/edit-partner/edit-partner.component';
import { ListPartnersComponent } from './components/partner/list-partner/list-partner.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ReservationsListComponent } from './components/reservation/list-reservation/list-reservation.component';
import { ReservationDetailsComponent } from './components/reservation/reservation-details/reservation-details.component';
import { HistoriquePaiementComponent } from './components/payment-history/payment-history.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddUserComponent } from './components/user/add-user/add-user.component';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AddBoatComponent,
    EditBoatComponent,
    ListBoatsComponent,
    EditReservationComponent,
    ReservationsListComponent,
    UserListComponent,
    EditUserComponent,
    AuthComponent,
    AlertComponent,
    ProfileComponent,
    EditProfileComponent,
    BoatDetailsComponent,
    ImageUploadComponent,
    BoatDetailsComponent,
    ListPartnersComponent,
    AddPartnerComponent,
    EditPartnerComponent,
    ReservationDetailsComponent,
    HistoriquePaiementComponent,
    AddUserComponent




  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
     CommonModule,
     BrowserAnimationsModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
