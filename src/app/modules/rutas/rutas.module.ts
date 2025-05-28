import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearComponent } from './crear/crear.component';
import { RutasRoutingModule } from './rutas-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CrearComponent
  ],
  imports: [
    CommonModule,
    RutasRoutingModule,
    FormsModule
  ]
})
export class RutasModule { }
