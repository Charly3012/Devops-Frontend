import { Component, OnInit } from '@angular/core';
import { AssignmentService } from '../services/assignment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RutasService } from '../../rutas/services/rutas.service';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent implements OnInit {
  assignments: any[] = [];
  assignmentForm: FormGroup;
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  currentAssignmentId: number | null = null;
  searchTerm: string = '';
  currentPage: number = 1;
  lastPage: number = 1;

  showDeleteModal: boolean = false;
  assignmentToDelete: number | null = null;

  isRutaModalOpen: boolean = false;
  rutaForm: any = {
    name: '',
    route_date: '',
    start_latitude: '',
    start_longitude: '',
    end_latitude: '',
    end_longitude: ''
  };
  rutaFormTouched: any = {};
  currentAssignmentForRuta: number | null = null;

  constructor(
    private assignmentService: AssignmentService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private rutasService: RutasService
  ) {
    this.assignmentForm = this.fb.group({
      assignment_date: ['', [Validators.required, this.futureDateValidator()]],
      id_driver: ['', [Validators.required, Validators.min(1)]],
      id_vehicle: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(page: number = 1): void {
    this.assignmentService.getAssignments(page).subscribe(
      response => {
        this.assignments = response.data.data;
        this.currentPage = response.data.current_page;
        this.lastPage = response.data.last_page;
      },
      error => {
        console.error('Error al cargar asignaciones:', error);
        this.toastr.error('No se pudieron cargar las asignaciones.');
      }
    );
  }

  futureDateValidator() {
    return (control: { value: string | number | Date; }) => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        return { pastDate: true };
      }
      return null;
    };
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.assignmentForm.reset();
    this.isModalOpen = true;
  }

  openEditModal(assignment: any): void {
    if (new Date(assignment.assignment_date) < new Date(new Date().setHours(0,0,0,0))) {
      this.toastr.warning('No se puede editar una asignación pasada.');
      return;
    }
    this.isEditMode = true;
    this.currentAssignmentId = assignment.id_assignment;
    this.assignmentForm.patchValue({
      assignment_date: assignment.assignment_date,
      id_driver: assignment.id_driver,
      id_vehicle: assignment.id_vehicle
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.assignmentForm.reset();
    this.currentAssignmentId = null;
  }

  saveAssignment(): void {
    if (this.assignmentForm.invalid) {
      this.assignmentForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.currentAssignmentId !== null) {
      this.assignmentService.updateAssignment(this.currentAssignmentId, this.assignmentForm.value).subscribe(
        response => {
          this.toastr.success('Asignación actualizada exitosamente');
          this.loadAssignments(this.currentPage);
          this.closeModal();
        },
        error => this.handleError(error, 'actualizar')
      );
    } else {
      this.assignmentService.createAssignment(this.assignmentForm.value).subscribe(
        response => {
          this.toastr.success('Asignación creada exitosamente');
          this.loadAssignments(this.currentPage);
          this.closeModal();
        },
        error => this.handleError(error, 'crear')
      );
    }
  }

  handleError(error: any, action: string): void {
    console.error(`Error al ${action} la asignación:`, error);
    if (error.error && error.error.errors) {
      let errorMessages = '';
      for (const key in error.error.errors) {
        if (error.error.errors.hasOwnProperty(key)) {
          errorMessages += `${error.error.errors[key].join(', ')}\n`;
        }
      }
      this.toastr.error(`Errores de validación:\n${errorMessages}`);
    } else if (error.error && error.error.message) {
      this.toastr.error(error.error.message);
    } else {
      this.toastr.error(`Ocurrió un error inesperado al ${action} la asignación.`);
    }
  }

  confirmDelete(id: number): void {
    this.assignmentToDelete = id;
    this.showDeleteModal = true;
  }

  deleteConfirmed(): void {
    if (this.assignmentToDelete !== null) {
      this.assignmentService.deleteAssignment(this.assignmentToDelete).subscribe(
        response => {
          this.toastr.success("Asignación eliminada exitosamente.");
          this.loadAssignments(this.currentPage);
        },
        error => {
          //console.error('Error al eliminar la asignación:', error);
          this.toastr.error('Error al eliminar la asignación.');
        }
      );
    }
    this.closeDeleteModal();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.assignmentToDelete = null;
  }

  searchAssignment(): void {
    if (this.searchTerm) {
      this.assignmentService.getAssignmentById(Number(this.searchTerm)).subscribe(
        response => {
          this.assignments = [response.data];
          this.currentPage = 1;
          this.lastPage = 1;
        },
        error => {
          console.error('Error encontrando la asifnación:', error);
          this.assignments = [];
          this.toastr.error('Asignación no encontrada.');
        }
      );
    } else {
      this.loadAssignments();
    }
  }

  get formControls() {
    return this.assignmentForm.controls;
  }

  asignarRuta(assignmentId: number) {
    this.currentAssignmentForRuta = assignmentId;
    this.isRutaModalOpen = true;
    this.rutaForm = {
      name: '',
      route_date: '',
      start_latitude: '',
      start_longitude: '',
      end_latitude: '',
      end_longitude: ''
    };
    this.rutaFormTouched = {};
  }

  closeRutaModal() {
    this.isRutaModalOpen = false;
    this.currentAssignmentForRuta = null;
    this.rutaForm = {
      name: '',
      route_date: '',
      start_latitude: '',
      start_longitude: '',
      end_latitude: '',
      end_longitude: ''
    };
    this.rutaFormTouched = {};
  }

  saveRuta() {
    this.rutaFormTouched = {
      name: true,
      route_date: true,
      start_latitude: true,
      start_longitude: true,
      end_latitude: true,
      end_longitude: true
    };
    if (!this.rutaForm.name || this.rutaForm.name.length > 100) return;
    if (!this.rutaForm.route_date) return;
    if (this.rutaForm.start_latitude === '' || this.rutaForm.start_latitude < -90 || this.rutaForm.start_latitude > 90) return;
    if (this.rutaForm.start_longitude === '' || this.rutaForm.start_longitude < -180 || this.rutaForm.start_longitude > 180) return;
    if (this.rutaForm.end_latitude === '' || this.rutaForm.end_latitude < -90 || this.rutaForm.end_latitude > 90) return;
    if (this.rutaForm.end_longitude === '' || this.rutaForm.end_longitude < -180 || this.rutaForm.end_longitude > 180) return;
    if (this.currentAssignmentForRuta === null) return;
    const ruta: any = {
      id: 0,
      id_assignment: this.currentAssignmentForRuta,
      name: this.rutaForm.name,
      route_date: this.rutaForm.route_date,
      start_latitude: Number(this.rutaForm.start_latitude),
      start_longitude: Number(this.rutaForm.start_longitude),
      end_latitude: Number(this.rutaForm.end_latitude),
      end_longitude: Number(this.rutaForm.end_longitude)
    };
    this.rutasService.createRuta(ruta).subscribe({
      next: () => {
        this.toastr.success('Ruta asignada exitosamente');
        this.closeRutaModal();
        this.loadAssignments(this.currentPage);
      },
      error: (error) => {
        this.toastr.error('Error al asignar la ruta.');
      }
    });
  }
}