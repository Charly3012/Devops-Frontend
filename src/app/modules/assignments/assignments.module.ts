import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentsRoutingModule } from './assignments-routing.module';
import { GestionComponent } from './gestion/gestion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 

@NgModule({
  declarations: [
    GestionComponent 
  ],
  imports: [
    CommonModule,
    AssignmentsRoutingModule,
    FormsModule,        
    ReactiveFormsModule, 
    HttpClientModule
  ]
})
export class AssignmentsModule { }
