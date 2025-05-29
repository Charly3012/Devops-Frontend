import { Component, OnInit } from '@angular/core';
import { RutasService } from '../services/rutas.service';
import { Ruta } from '../models/ruta.model';
import { ToastrService } from 'ngx-toastr';
import type { ModalInterface } from 'flowbite';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent implements OnInit {
  rutas: Ruta[] = [];
  selectedRuta: Ruta = {  // Ruta seleccionada para editar
    id: 0,
    id_assignment: 0,
    name: '',
    route_date: '',
    was_successful: null,
    problem_description: null,
    comments: null,
    start_latitude: 0,
    start_longitude: 0,
    end_latitude: 0,
    end_longitude: 0
  };
  modal: ModalInterface | null = null;
  deleteId: number | null = null;

  constructor(
    private rutasService: RutasService,
    private toastService: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadRutas();
  }

  // -------------------------- Solicitudes Backend -------------------------------------
  loadRutas(): void {
    this.rutasService.getRutas().subscribe({
      next: (data) => {
        this.rutas = data;
      },
      error: (error) => {
        this.toastService.error("Error al actualizar la ruta");
      }
    });
  }

  updateRuta(form?: NgForm): void {
    if (form && form.invalid) {
      this.toastService.error("Por favor corrige los errores del formulario.");
      return;
    }

    // Actualizar local
    const index = this.rutas.findIndex(r => r.id === this.selectedRuta.id);
    if (index !== -1) {
      this.rutas[index] = { ...this.selectedRuta };
    }
    
    // Actualizar en el backend
    this.rutasService.updateRuta(this.selectedRuta.id, this.selectedRuta).subscribe({
      next: (data) => {
        this.toastService.success("Ruta actualizada exitosamente");
        this.loadRutas();
      },
      error: (error) => {
        this.toastService.error("Error al actualizar la ruta");
      }
    });

    this.closeEditModal();
  }

  createRuta(): void {
    const newRuta : Ruta = {
      id: 0,
      id_assignment: 0,
      name: '',
      route_date: '',
      created_at: '',
      was_successful: 0,
      problem_description: '',
      comments : '',
      start_latitude: 89,
      start_longitude: 89,
      end_latitude: 89,
      end_longitude: 89,
    }

    this.rutasService.createRuta(newRuta).subscribe({
      next: (data) => {
        this.toastService.success("Ruta creada");
        this.loadRutas();
      },
      error: (error) => {
        this.toastService.error("Error al crear ruta");
      }
    })
  }

  deleteRuta(id: number):void {
    this.rutasService.deleteRuta(id).subscribe({
      next: () => {
        this.toastService.success("Ruta eliminada exitosamente");
        this.loadRutas();
      },
      error: (error) => {
        this.toastService.error("Error al eliminar ruta");
      }
    })
  }

  // -------------------------- Modal Edit -------------------------------------
  openEditModal(ruta: Ruta): void {
    this.selectedRuta = { ...ruta };
    
    // Mostrar el modal
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      modalElement.classList.remove('hidden');
      modalElement.classList.add('flex');
      
      setTimeout(() => {
        modalElement.style.opacity = '1';
      }, 10);
    }
  }

  closeEditModal(): void {
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      modalElement.style.opacity = '0';
      
      setTimeout(() => {
        modalElement.classList.add('hidden');
        modalElement.classList.remove('flex');
      }, 300);
    }
  }

  // -------------------------- Modal Eliminar ------------------------------------- 
  openDeleteModal(id: number): void {
    this.deleteId = id;
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      modalElement.classList.remove('hidden');
    }
  }

  closeDeleteModal(): void {
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      modalElement.classList.add('hidden');
    }
    this.deleteId = null;
  }

  confirmDelete(): void {
    if (this.deleteId !== null) {
      this.deleteRuta(this.deleteId);
      this.closeDeleteModal();
    }
  }

}
