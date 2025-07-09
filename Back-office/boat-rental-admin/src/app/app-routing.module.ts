import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBoatsComponent } from './components/boats/list-boats/list-boats.component';
import { AddBoatComponent } from './components/boats/add-boats/add-boats.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditBoatComponent } from './components/boats/edit-boats/edit-boats.component';
import { AuthComponent } from './components/auth/auth.component';
import { UserListComponent } from './components/user/list-user/list-user.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { BoatDetailsComponent } from './components/boats/details-boats/details-boats.component';


const routes: Routes = [

 { path: 'dashboard',canActivate: [AuthGuard], component: DashboardComponent },
  { path: 'list',canActivate: [AuthGuard], component: ListBoatsComponent },
   { path: 'add-boat',canActivate: [AuthGuard], component: AddBoatComponent },
   { path: 'edit-boat/:id',canActivate: [AuthGuard], component: EditBoatComponent },
   {path : '' ,  component:AuthComponent},
   { path: 'users',canActivate: [AuthGuard], component: UserListComponent },
   { path: 'edit-user/:id', canActivate: [AuthGuard],component: EditUserComponent,

  data: { roles: ['ADMIN'] } },
   { path: 'profile',canActivate: [AuthGuard], component: ProfileComponent },
    { path: 'edit-profile',canActivate: [AuthGuard], component: EditProfileComponent },
    {
  path: 'boat-details/:id',component: BoatDetailsComponent},
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
