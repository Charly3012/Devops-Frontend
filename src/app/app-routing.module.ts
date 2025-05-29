import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthYesLoginGuard } from './core/guards/auth-yes-login.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthLayoutComponent } from './core/layout/auth-layout/auth-layout.component';
import { MainComponent } from './core/layout/main/main.component';
import { HomeComponent } from './modules/home/pages/home/home.component';

const routes: Routes = [


  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [AuthYesLoginGuard],
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'menu',
    component: MainComponent,
    canActivate: [AuthGuard],
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
        path: 'rutas',
        loadChildren: () => import('./modules/rutas/rutas.module').then(m => m.RutasModule)
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
