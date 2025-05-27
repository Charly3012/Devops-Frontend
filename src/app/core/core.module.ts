import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContentComponent } from './components/content/content.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { MainComponent } from './layout/main/main.component';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    SideBarComponent,
    MainComponent,
    AuthLayoutComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    SideBarComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class CoreModule { }
