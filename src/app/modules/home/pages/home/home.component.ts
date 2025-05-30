import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../stats.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private statsService: StatsService,
    private toastService: ToastrService
  ) { }

  public driversCount: number = 0;
  public vehiculosCount: number = 0;
  public usersCount: number = 0;
  public routesToday: number = 0;

  ngOnInit(): void {
    this.getAllDrivers();
    this.getAllVehiculos();
    this.getAllUsers();
    this.getRoutesToday();
  }

  getAllDrivers(){
    this.statsService.getAllDrivers().subscribe({
      next: (response:any) => {

        this.driversCount = response.data.length;
      },

      error: (err) => {
        this.toastService.warning("Error cargando los conductores");
        return;
      }
    });
  }

  getAllVehiculos(){
    this.statsService.getAllVehiculos().subscribe({
      next: (response:any) => {
        this.vehiculosCount = response.data.length;
      },

      error: (err) => {
        this.toastService.warning("Error cargando los vehiculos");
        return;
      }
    });
  }

  getAllUsers(){
      this.statsService.getAllUsers().subscribe({
        next: (response:any) => {
          this.usersCount = response.data.length;
        },

        error: (err) => {
          this.toastService.warning("Error cargando los usuarios");
          return;
        }
      });
  }

  getRoutesToday(){
    this.statsService.getRoutesToday().subscribe({
        next: (response:any) => {
          this.usersCount = response.data.length;
        },

        error: (err) => {
          this.toastService.warning("Error cargando los viajes");
          return;
        }
      });
  }

}
