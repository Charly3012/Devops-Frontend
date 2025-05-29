import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'flowbite';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { loginRequest, loginResponse} from '../../models/login.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit{
  @ViewChild('popupModal') popupModalRef!: ElementRef;

  loginForm: FormGroup;
  private resetPasswordModal!: Modal;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
    if (params['redirected'] === 'true') {
      this.toastService.info('Inicie sesión para acceder a todas las funcionalidades', 'Usuario no autenticado');
    }
  });
  }

  ngAfterViewInit(): void {
    this.resetPasswordModal = new Modal(this.popupModalRef.nativeElement);
  }

  async loginSendRequest(){
    if(this.loginForm.invalid){
      this.toastService.warning('Algunos campos no son validos');
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginRequest : loginRequest = this.loginForm.value;

    this.authService.login(loginRequest).subscribe({
      next:(response: loginResponse) => {
        this.toastService.success('Redireccionando...', 'Inicio de sesión exitoso');
        setTimeout(() => {
          this.authService.setToken(response.token);
          this.router.navigate(['/menu/home']);
        }, 1200);

      },
      error: (err: HttpErrorResponse) => {
        if(err.status == 401){
          this.toastService.warning('Verifique los datos e intente nuevamente', 'Correo y/o contraseña incorrectos');
        }
      }
    });


  }

  resetPassword(){
    this.resetPasswordModal.show();
  }

  closeResetPasswordModal(): void {
    this.resetPasswordModal.hide();
  }


}
