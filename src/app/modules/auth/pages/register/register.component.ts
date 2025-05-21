import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { registerReponse, registerRequest } from '../../models/register.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      invitation_code: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  registerSendRequest(){
    if(this.registerForm.invalid){
      this.registerForm.markAsTouched();
      return;
    }

    const registerRequest: registerRequest = this.registerForm.value;

    this.authService.register(registerRequest).subscribe({
      next: (response: registerReponse) => {
        console.log('registro exitoso: ', response);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error.message);
        console.log('Error en el registro')
      }
    });

  }



}
