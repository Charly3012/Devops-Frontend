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
        pathMatch: 'full'  // importante que sea full para redirigir solo cuando la ruta sea exactamente /menu
      },
      {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'asignaciones', 
        loadChildren: () => import('./modules/assignments/assignments.module').then(m => m.AssignmentsModule) 
      }
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
