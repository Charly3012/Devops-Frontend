import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { admin, getAllAdminsResponse } from '../../models/admin.models';
import { AdminService } from '../../services/admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'flowbite';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
  @ViewChild('deleteAdminModal') deleteAdminModalRef!: ElementRef;

  public adminList?: admin[] = [];
  public selectedAdminId: number = 0;
  private deleteAdminModal!: Modal; 


  constructor(
    private adminService: AdminService,
    private toastService: ToastrService
  ) { }
  ngAfterViewInit(): void {
    this.deleteAdminModal = new Modal(this.deleteAdminModalRef.nativeElement);
  }

  ngOnInit(): void {
    this.getAllAdmins();
  }
  

  getAllAdmins() {
    this.adminService.getAllAdmins().subscribe({
      next: (response: getAllAdminsResponse) => {
        this.adminList = response.data;
      },
      error: (err: HttpErrorResponse) => {
        this.toastService.warning('Error', 'Error cargando los administradores');
      }
    });
  }
  // Delete admin
  deleteShowModal(id: number) {
    this.deleteAdminModal.show();
    this.selectedAdminId = id;
  }
  deleteHideModal() {
    this.deleteAdminModal.hide();
    this.selectedAdminId = 0;
  }
  deleteAdminRequest() {
    const id = this.selectedAdminId
    this.deleteHideModal();
    this.adminService.deleteAdmin(id).subscribe({
      next: (response) => {
        this.getAllAdmins();
        this.toastService.success('Adminsitrador eliminado correctamente!');
      },
      error: () => {
        this.getAllAdmins();
        return;
      }
    });
  }
  
}
