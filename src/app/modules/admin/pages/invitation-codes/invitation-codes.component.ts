import { Component, OnInit, ViewChild,ElementRef, AfterViewInit} from '@angular/core';
import { invitationCode } from '../../models/invitation-codes.models';
import { AdminService } from '../../services/admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'flowbite';


@Component({
  selector: 'app-invitation-codes',
  templateUrl: './invitation-codes.component.html',
  styleUrls: ['./invitation-codes.component.scss']
})
export class InvitationCodesComponent implements OnInit, AfterViewInit {
  @ViewChild('addInvitationCodeModal') addInvCodeModalRef!: ElementRef;

  private addInvitationCodeModal!:Modal

  constructor(
    private adminService: AdminService,
    private toastService: ToastrService   

  ) { }

  ngOnInit(): void {
    this.getInvitationCodes();
  }
ngAfterViewInit(): void {
    this.addInvitationCodeModal = new Modal(this.addInvCodeModalRef.nativeElement)
}

  invitationCodes?: invitationCode[]=[]


  getInvitationCodes() {
    this.adminService.getAllInvitationCodes().subscribe(
      {
        next: (response) => {
          this.invitationCodes = response.data;
        },
        error:(err: HttpErrorResponse) => {
          // Mostrar que lgo salió mal
          if (err.status >= 400 && err.status < 499) {
            this.toastService.warning("Intente nuevamente", "Algo salió mal");
            return;
          }
          if (err.status >= 500 && err.status < 599) {
            this.toastService.warning("Intente nuevamente más tarde", "Error del servidor");
            return;
          }
        }
        
      }
    );
  }
  hideAddModal() {
    this.addInvitationCodeModal.hide();
  }
  addInvitationCode() {
    this.addInvitationCodeModal.show();


  }
}
