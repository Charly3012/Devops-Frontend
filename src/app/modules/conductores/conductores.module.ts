import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionComponent } from './gestion/gestion.component';
import { ConductoresRoutingModule } from './conductores-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GestionComponent],
  imports: [
    CommonModule,
    ConductoresRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ConductoresModule { }
