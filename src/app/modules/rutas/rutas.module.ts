import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearComponent } from './crear/crear.component';
import { RutasRoutingModule } from './rutas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CrearComponent
  ],
  imports: [
    CommonModule,
    RutasRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RutasModule { }
