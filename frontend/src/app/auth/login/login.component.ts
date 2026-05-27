import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './login.component.html',

  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  //  FORM
  email = '';

  password = '';

  //  ERROR
  error = '';

  //  SUCCESS
  success = '';

  // LOADING
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  //  LOGIN
  login(): void {

    // CLEAR MESSAGES
    this.error = '';
    this.success = '';

    //  VALIDATION
    if (
      !this.email.trim() ||
      !this.password.trim()
    ) {

      this.error =
        'Todos los campos son obligatorios';

      return;
    }

    //  START LOADING
    this.loading = true;

    // LOGIN REQUEST
    this.auth.login({

      email: this.email,

      password: this.password

    }).subscribe({

      //  SUCCESS
      next: (response) => {

        console.log(
          'LOGIN SUCCESS =>',
          response
        );

        // STOP LOADING
        this.loading = false;

        // SAVE TOKEN
        this.auth.saveToken(
          response.token
        );

        // SUCCESS MESSAGE
        this.success =
          'Inicio de sesión exitoso';

        // REDIRECT
        setTimeout(() => {

          this.router.navigate(['/board']);

        }, 1000);
      },

      //  ERROR
      error: (err) => {

        console.log(
          'LOGIN ERROR =>',
          err
        );

        // STOP LOADING
        this.loading = false;

        // BACKEND MESSAGE
        if (err.error?.message) {

          this.error =
            err.error.message;

        } else {

          this.error =
            'Correo o contraseña incorrectos';
        }
      }
    });
  }

  // GO TO REGISTER
  goToRegister(): void {

    this.router.navigate(['/register']);
  }
}
