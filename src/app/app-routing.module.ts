import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './core/layout/main/main.component';
import { HomeComponent } from './modules/home/pages/home/home.component';

const routes: Routes = [

  {
    path: 'menu',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'  
      },
      {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      },
      { 
        path: 'vehiculos', 
        loadChildren: () => import('./modules/vehiculos/vehiculos.module').then(m => m.VehiculosModule) 
      },
    ]
  },
  {
    path: '',
    redirectTo: 'menu/home',
    pathMatch: 'full'
  },



  {
    path: '**',
    redirectTo: 'menu/home'
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
