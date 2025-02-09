import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private authService: AuthService){}

  register(){
    this.authService.register(this.signupForm.getRawValue()).subscribe((value: any) => {
      this.authService.login({email: this.signupForm.getRawValue().email, password: this.signupForm.getRawValue().password}).subscribe((value: any)=>{
        
      });
    });
  }
}
