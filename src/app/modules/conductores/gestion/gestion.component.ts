import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DriverService } from '../services/driver.service';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent implements OnInit {
  form: FormGroup;
  mostrarModal = false;
  drivers: any[] = [];
  meta: any;
  currentPage = 1;
  modoEdicion = false;
  conductorEditando: any = null;
  originalDrivers: any[] = []; 
  searchTerm: string = '';
  orderDirection: 'asc' | 'desc' = 'asc';
  dropdownOpen: number | null = null;

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      birth_date: ['', Validators.required],
      curp: ['', Validators.required],
      address: ['', Validators.required],
      monthly_salary: ['', Validators.required],
      license_number: ['', Validators.required],
      system_entry_date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(page: number = 1): void {
    this.driverService.getAll().subscribe({
      next: (res) => {
        this.originalDrivers = res;
        this.drivers = res;
        this.filterDrivers();
      },
      error: (err) => console.error('Error al cargar conductores:', err)
    });
  }

  filterDrivers(): void {
    const term = this.searchTerm.trim().toLowerCase();
    let filtered = this.originalDrivers;

    if (term) {
      filtered = filtered.filter(d =>
        d.curp.toLowerCase().includes(term)
      );
    }

    if (this.orderDirection) {
      filtered = filtered.sort((a, b) => {
        const dateA = new Date(a.system_entry_date).getTime();
        const dateB = new Date(b.system_entry_date).getTime();
        return this.orderDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    this.drivers = filtered;
  }

  toggleOrder(): void {
    this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    this.filterDrivers();
  }

  deleteAllDrivers(): void {
    if (!confirm('¿Seguro que deseas eliminar TODOS los conductores?')) return;

    const deleteRequests = this.drivers.map(d =>
      this.driverService.delete(d.id).toPromise()
    );

    Promise.all(deleteRequests)
      .then(() => {
        console.log('Todos los conductores eliminados');
        this.loadDrivers();
      })
      .catch(err => console.error('Error al eliminar todos:', err));
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadDrivers(page);
  }

  onSubmit(): void {
    const values = this.form.value;

    const obs = this.modoEdicion
      ? this.driverService.update(this.conductorEditando.id, values)
      : this.driverService.create(values);

    obs.subscribe({
      next: () => {
        this.mostrarModal = false;
        this.form.reset();
        this.modoEdicion = false;
        this.conductorEditando = null;
        this.loadDrivers();
      },
      error: (err) => console.error('Error:', err)
    });
  }

  openDropdown(driver: any) {
    this.dropdownOpen =
      this.dropdownOpen === driver.id ? null : driver.id;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedBtn = !!target.closest('[data-dropdown-button]');
    const clickedMenu = !!target.closest('[data-dropdown]');

    if (!clickedBtn && !clickedMenu) {
      this.dropdownOpen = null;
    }
  }

  editDriver(driver: any): void {
    this.modoEdicion = true;
    this.conductorEditando = driver;
    this.form.patchValue(driver);
    this.mostrarModal = true;
  }

  deleteDriver(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este conductor?')) {
      this.driverService.delete(id).subscribe({
        next: () => {
          console.log('Conductor eliminado:', id);
          this.loadDrivers();
        },
        error: (err) => console.error('Error al eliminar conductor:', err)
      });
    }
  }

  closeModal(): void {
    this.mostrarModal = false;
    this.modoEdicion = false;
    this.conductorEditando = null;
    this.form.reset();
  }

  abrirModalNuevo(): void {
    this.mostrarModal = true;
    this.modoEdicion = false;
    this.conductorEditando = null;
    this.form.reset();
  }
}
