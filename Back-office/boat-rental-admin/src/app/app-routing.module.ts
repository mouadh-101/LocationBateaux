import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBoatsComponent } from './components/boats/list-boats/list-boats.component';
import { AddBoatComponent } from './components/boats/add-boats/add-boats.component';
const routes: Routes = [


  { path: 'list', component: ListBoatsComponent },
   { path: 'add-boat', component: AddBoatComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
