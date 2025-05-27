import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { registerReponse, registerRequest } from '../../models/register.model';
import { AuthService } from '../../services/auth.service';
import { PasswordMatchValidator } from '../../Validators/password-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastrService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      re_password: ['', Validators.required],
      invitation_code: ['', Validators.required]
    }, {
      validators: PasswordMatchValidator('password', 're_password')
    });
  }

  ngOnInit(): void {
  }

  async registerSendRequest(){
    if(this.registerForm.invalid){
      this.toastService.warning('Algunos campos no son validos');
      this.registerForm.markAllAsTouched();
      return;
    }

    const registerRequest: registerRequest = this.registerForm.value;

    this.authService.register(registerRequest).subscribe({
      next: (response: registerReponse) => {
        this.toastService.success("Usuario creado exitosamente");
        this.toastService.info("Redireccionando a la pestaña de incio de sesión...");
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2500);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        if(err.status >= 400 && err.status <= 499){
          this.toastService.warning(err.error.message, 'Verifique los datos de formulario');
          const specificErrors: { [key: string]: string[] } = err.error.errors;
          if (specificErrors) {
            Object.keys(specificErrors).forEach((field) => {
              specificErrors[field].forEach((msg: string) => {
                this.toastService.warning(msg, `Campo: ${field}`);
              });
            });
          }

          return;
        }

        if(err.status >= 500 && err.status <= 599){
          this.toastService.error(err.error.message, 'Error interno: Intente de nuevo mas tarde');
          return;
        }
      }
    });

  }





}
