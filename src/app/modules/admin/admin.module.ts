import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './pages/admin/admin.component';
import { InvitationCodesComponent } from './pages/invitation-codes/invitation-codes.component';


@NgModule({
  declarations: [
    AdminComponent,
    InvitationCodesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
