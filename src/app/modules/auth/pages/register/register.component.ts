import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { registerReponse, registerRequest } from '../../models/register.model';
import { AuthService } from '../../services/auth.service';
import { PasswordMatchValidator } from '../../Validators/password-match.validator';
import { ReturnStatement } from '@angular/compiler';

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
        }, 1200);
      },
      error: (err: HttpErrorResponse) => {
        return;
      }
    });

  }





}
