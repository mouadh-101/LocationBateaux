import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './front-office/components/home/home.component';
import { NotFoundComponent } from './front-office/components/not-found/not-found.component';
const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./front-office/front-office.module').then(m => m.FrontOfficeModule)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./back-office/back-office.module').then(m => m.BackOfficeModule)
  },
  { path: '**', component: NotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
