import { Component, OnInit, ViewChild,ElementRef, AfterViewInit} from '@angular/core';
import { createCodeRequest, editCodeRequest, invitationCode } from '../../models/invitation-codes.models';
import { AdminService } from '../../services/admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'flowbite';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { subscribe } from 'diagnostics_channel';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-invitation-codes',
  templateUrl: './invitation-codes.component.html',
  styleUrls: ['./invitation-codes.component.scss']
})
export class InvitationCodesComponent implements OnInit, AfterViewInit {
  @ViewChild('addInvitationCodeModal') addInvCodeModalRef!: ElementRef;
  @ViewChild('deleteConfirmationModal') deleteInvCodeModalRef!: ElementRef;
  @ViewChild('editInvitationCodeModal') editInvitationCodeModalRef!: ElementRef;

  private addInvitationCodeModal!:Modal;
  private deleteInvitationCodeModal!:Modal;
  private editInvitationCodeModal!:Modal;
  public invitationCodes?: invitationCode[]=[]
  public today?: string;
  public createCodeForm: FormGroup;
  public selectedCode: number= 0;
  public editCodeForm: FormGroup;

  constructor(
    private adminService: AdminService,
    private toastService: ToastrService,
    private formBuilder: FormBuilder,
  ) {
    this.createCodeForm = this.formBuilder.group({
      code: ['', Validators.required],
      expires_at: ['', Validators.required]
    });

    this.editCodeForm = this.formBuilder.group({
      code: ['', Validators.required],
      expires_at: ['', Validators.required],
      used_status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getInvitationCodes();
    const now = new Date();
    this.today = now.toISOString().split('T')[0]; // yyyy-MM-dd
  }

  ngAfterViewInit(): void {
    this.addInvitationCodeModal = new Modal(this.addInvCodeModalRef.nativeElement)
    this.deleteInvitationCodeModal = new Modal(this.deleteInvCodeModalRef.nativeElement);
    this.editInvitationCodeModal = new Modal(this.editInvitationCodeModalRef.nativeElement);
  }

  getInvitationCodes() {
    this.adminService.getAllInvitationCodes().subscribe(
      {
        next: (response) => {
          this.invitationCodes = response.data;
        },
        error:(err: HttpErrorResponse) => {
          return;
        }
      }
    );
  }

  //Add new invitation codes methods
  hideAddModal() {
    this.addInvitationCodeModal.hide();
    this.createCodeForm.reset();
  }

  showAddModal() {
    this.addInvitationCodeModal.show();
  }

  addInvitationCodeRequest(){
    if(this.createCodeForm.valid){
      const dataForm = this.createCodeForm.value;
      const dataRequest: createCodeRequest = {
        code : dataForm.code,
        expires_at: new Date(`${dataForm.expires_at}T23:59:00.000Z`)
      }
      this.hideAddModal();
      this.adminService.createInvitationCode(dataRequest).subscribe({
        next: (response) => {
          this.toastService.success('¡Código de invitación creado!');
          this.getInvitationCodes();
        },
        error:(err: HttpErrorResponse) => {
          return;
        }
      });
    }else{
      this.createCodeForm.markAllAsTouched();
    }
  }

  // Delete invitation code 
  deleteShowModal(id: number) {
    this.deleteInvitationCodeModal.show();
    this.selectedCode = id;
  }
  deleteHideModal() {
    this.deleteInvitationCodeModal.hide();
    this.selectedCode = 0;
  }
  deleteCodeRequest() {
    const id = this.selectedCode
    this.deleteHideModal();
    this.adminService.deleteInvitationCode(id).subscribe({
      next: (response) => {
        this.getInvitationCodes();
        this.toastService.success('¡Código de invitación eliminado correctamente!');
        
      },
      error: () => {
        this.getInvitationCodes();
        return;
      }
    });
  }
  // Edit Modal
  editShowModal(data: invitationCode) {
    this.selectedCode = data.id;
    this.editInvitationCodeModal.show();
    const dateOnly = new Date(data.expires_at).toISOString().split('T')[0]; 
    const actualData: any ={
      code: data.code,
      used_status: data.used_status ? "1" : "0",
      expires_at: dateOnly
    }
    this.editCodeForm.setValue(actualData);
  }
  editHideModal() {

    this.editInvitationCodeModal.hide();
    this.selectedCode = 0;
    this.editCodeForm.reset();
  }
  editCodeRequest() {
    const id = this.selectedCode;
    if(this.editCodeForm.valid){
      const dataForm = this.editCodeForm.value;
      const dataRequest : editCodeRequest = {
        code: dataForm.code,
        used_status: dataForm.used_status === "1" ? true : false,
        expires_at: new Date(`${dataForm.expires_at}T23:59:00.000Z`)
      }
      this.editHideModal();
      this.adminService.editInvitationCode(dataRequest, id).subscribe({
        next: (response) => {
          this.getInvitationCodes();
          this.toastService.success('¡Código de invitación editado correctamente!');
        },
        error: () => {
          return;
        }
      });
    }
    
  }

}
