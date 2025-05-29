import { Component, OnInit, ViewChild,ElementRef, AfterViewInit} from '@angular/core';
import { createCodeRequest, invitationCode } from '../../models/invitation-codes.models';
import { AdminService } from '../../services/admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'flowbite';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { subscribe } from 'diagnostics_channel';
import { LoadingService } from 'src/app/shared/services/loading.service';


@Component({
  selector: 'app-invitation-codes',
  templateUrl: './invitation-codes.component.html',
  styleUrls: ['./invitation-codes.component.scss']
})
export class InvitationCodesComponent implements OnInit, AfterViewInit {
  @ViewChild('addInvitationCodeModal') addInvCodeModalRef!: ElementRef;

  private addInvitationCodeModal!:Modal;
  public invitationCodes?: invitationCode[]=[]
  public today?: string;
  public createCodeForm: FormGroup;

  constructor(
    private adminService: AdminService,
    private toastService: ToastrService,
    private formBuilder: FormBuilder,
  ) {
    this.createCodeForm = this.formBuilder.group({
      code: ['', Validators.required],
      expires_at: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getInvitationCodes();
    const now = new Date();
    this.today = now.toISOString().split('T')[0]; // yyyy-MM-dd
  }

  ngAfterViewInit(): void {
    this.addInvitationCodeModal = new Modal(this.addInvCodeModalRef.nativeElement)
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
      console.log(dataForm.expires_at);
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


}
