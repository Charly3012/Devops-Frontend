import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearComponent } from './crear/crear.component';
import { VehiculosRoutingModule } from './vehiculos-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [CrearComponent],
  imports: [
    CommonModule,
    VehiculosRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class VehiculosModule { }
