import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBoatsComponent } from './components/boats/list-boats/list-boats.component';
import { AddBoatComponent } from './components/boats/add-boats/add-boats.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditBoatComponent } from './components/boats/edit-boats/edit-boats.component';
const routes: Routes = [

 { path: '', component: DashboardComponent },
  { path: 'list', component: ListBoatsComponent },
   { path: 'add-boat', component: AddBoatComponent },
   { path: 'edit-boat/:id', component: EditBoatComponent },
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
