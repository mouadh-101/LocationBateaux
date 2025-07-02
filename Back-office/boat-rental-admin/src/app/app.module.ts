import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { AddBoatComponent } from './components/boats/add-boats/add-boats.component';
import { EditBoatComponent } from './components/boats/edit-boats/edit-boats.component';
import { ListBoatsComponent } from './components/boats/list-boats/list-boats.component';

import { DeleteReservationComponent } from './components/reservation/delete-reservation/delete-reservation.component';
import { AddReservationComponent } from './components/reservation/add-reservation/add-reservation.component';
import { EditReservationComponent } from './components/reservation/edit-reservation/edit-reservation.component';
import { ListReservationComponent } from './components/reservation/list-reservation/list-reservation.component';
import { ListUserComponent } from './components/user/list-user/list-user.component';
import { AddUserComponent } from './components/user/add-user/add-user.component';
import { DeleteUserComponent } from './components/user/delete-user/delete-user.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AddBoatComponent,
    EditBoatComponent,
    ListBoatsComponent,
    DeleteReservationComponent,
    AddReservationComponent,
    EditReservationComponent,
    ListReservationComponent,
    ListUserComponent,
    AddUserComponent,
    DeleteUserComponent,
    EditUserComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
