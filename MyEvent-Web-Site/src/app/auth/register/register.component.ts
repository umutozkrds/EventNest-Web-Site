import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private authService: AuthService) { }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (form.value.password !== form.value.confirmPassword) {
      return;
    }
    const name = form.value.firstName + ' ' + form.value.lastName;
    this.authService.signup(name, form.value.email, form.value.password).subscribe({
      next: (response) => {
        form.reset();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
