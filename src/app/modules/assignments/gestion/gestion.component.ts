import { Component, OnInit } from '@angular/core';
import { AssignmentService } from '../services/assignment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private assignmentService: AssignmentService,
    private fb: FormBuilder,
    private toastr: ToastrService
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

  asignarRuta(assignment:number){
    console.log(assignment);
  }

}