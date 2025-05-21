import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { registerRequest } from '../models/register.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.registerForm = this.fb.group({

    })
  }

  ngOnInit(): void {
  }

  registerSendRequest(){
    if(this.registerForm.valid)
    {
      const registerRequest: registerRequest = this.registerForm.value;
      console.log('register request', registerRequest);
      //Llamar al backend
    }else{
      console.log('Formulario invialido');
      this.registerForm.markAllAsTouched();
    }

  }



}
