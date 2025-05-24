import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../services/vehicle.service';
import { environment } from 'src/environments/environment';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent implements OnInit {
  form: FormGroup;
  mostrarModal = false;
  vehicles: any[] = [];
  meta: any;
  currentPage = 1;
  modoEdicion = false;
  vehiculoEditando: any = null;
  previewFoto: string | null = null;
  originalVehicles: any[] = []; 
  searchTerm: string = '';
  orderDirection: 'asc' | 'desc' = 'asc';



  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService
  ) {
    this.form = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      vin: ['', Validators.required],
      plate_number: ['', Validators.required],
      purchase_date: [''],
      cost: [''],
      photo: [null]
    });
  }

  ngOnInit(): void {
    this.loadVehicles(); // Carga la tabla al iniciar
  }

  loadVehicles(page: number = 1): void {
  this.vehicleService.getVehicles(page).subscribe({
    next: (res) => {
      console.log('RESPUESTA PAGINADA:', res);
      this.originalVehicles = res.data;
      this.vehicles         = res.data;
      this.meta             = res;                
      this.currentPage      = res.current_page;   
      this.filterVehicles();
    },
    error: (err) => console.error('Error al cargar vehículos:', err)
  });
}




  filterVehicles(): void {
  const term = this.searchTerm.trim().toLowerCase();
  let filtered = this.originalVehicles;

  if (term) {
    filtered = filtered.filter(v =>
      v.plate_number.toLowerCase().includes(term)
    );
  }

  if (this.orderDirection) {
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.purchase_date).getTime();
      const dateB = new Date(b.purchase_date).getTime();
      return this.orderDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  this.vehicles = filtered;
  }


  toggleOrder(): void {
  this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
  this.vehicles.sort((a, b) => {
    const dateA = new Date(a.purchase_date).getTime();
    const dateB = new Date(b.purchase_date).getTime();
    return this.orderDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });
  }

  deleteAllVehicles(): void {
  if (!confirm('¿Seguro que deseas eliminar TODOS los vehículos?')) return;

  const deleteRequests = this.vehicles.map(v =>
    this.vehicleService.delete(v.id_vehicle).toPromise()
  );

  Promise.all(deleteRequests)
    .then(() => {
      console.log('Todos los vehículos eliminados');
      this.loadVehicles(this.currentPage);
    })
    .catch(err => console.error('Error al eliminar todos:', err));
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.meta.last_page) {
      this.loadVehicles(page);
    }
  }

  sortByDate(order: 'asc' | 'desc'): void {
  this.vehicles.sort((a, b) => {
    const dateA = new Date(a.purchase_date).getTime();
    const dateB = new Date(b.purchase_date).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
  }

  onSubmit(): void {
    const formData = new FormData();
    const values = this.form.value;

    for (const key in values) {
      if (key === 'photo') {
        if (values[key] instanceof File) {
          formData.append(key, values[key]);
        }
      } else if (values[key] !== null && values[key] !== undefined) {
        formData.append(key, values[key]);
      }
    }

    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    formData.append('registration_date', today);

    const obs = this.modoEdicion
      ? this.vehicleService.update(this.vehiculoEditando.id_vehicle, formData)
      : this.vehicleService.create(formData);

    obs.subscribe({
      next: () => {
        this.mostrarModal = false;
        this.form.reset();
        this.previewFoto = null;
        this.modoEdicion = false;
        this.vehiculoEditando = null;
        this.loadVehicles(this.currentPage);
        //this.currentPage = 1;
        //this.loadVehicles(1);
      },
      error: (err) => console.error('Error:', err)
    });
  }


  dropdownOpen: number | null = null; // control dropdown de acciones

  openDropdown(vehicle: any) {
    this.dropdownOpen =
      this.dropdownOpen === vehicle.id_vehicle
        ? null
        : vehicle.id_vehicle;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedBtn  = !!target.closest('[data-dropdown-button]');
    const clickedMenu = !!target.closest('[data-dropdown]');

    if (!clickedBtn && !clickedMenu) {
      this.dropdownOpen = null;
    }
  }


  editVehicle(vehicle: any): void {
    this.modoEdicion = true;
    this.vehiculoEditando = vehicle;
    this.form.patchValue(vehicle);
    this.previewFoto = vehicle.photo ? `${environment.storageUrl}/${vehicle.photo}` : null;
    this.mostrarModal = true;
  }


  deleteVehicle(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      this.vehicleService.delete(id).subscribe({
        next: () => {
          console.log('Vehículo eliminado:', id);
          this.loadVehicles(this.currentPage);
        },
        error: (err) => console.error('Error al eliminar vehículo:', err)
      });
    }
  }

  previewUrl: string | ArrayBuffer | null = null;

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ photo: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.previewFoto = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      const inputEvent = { target: { files: [file] } };
      this.onFileChange(inputEvent);
    }
  }

  closeModal(): void {
    this.mostrarModal = false;
    this.modoEdicion = false;
    this.vehiculoEditando = null;
    this.previewFoto = null;
    this.form.reset();
  }

  abrirModalNuevo(): void {
  this.mostrarModal = true;
  this.modoEdicion = false;
  this.vehiculoEditando = null;
  this.previewFoto = null;
  this.form.reset();
  }
  
  removeImage(): void {
    this.previewFoto = null;
    this.form.patchValue({ photo: null });
  }

}
