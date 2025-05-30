import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { InvitationCodesComponent } from './pages/invitation-codes/invitation-codes.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    pathMatch: 'full'
  },
  {
    path: 'invitation-codes',
    component: InvitationCodesComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
