import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './register.component.html',

  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  //  FORM
  name = '';

  email = '';

  password = '';

  //  ERROR
  error = '';

  // SUCCESS
  success = '';

  // LOADING
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  //  REGISTER
  register(): void {

    // CLEAR MESSAGES
    this.error = '';
    this.success = '';

    // VALIDATION
    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.password.trim()
    ) {

      this.error =
        'Todos los campos son obligatorios';

      return;
    }

    //START LOADING
    this.loading = true;

    //  REGISTER REQUEST
    this.auth.register({

      name: this.name,

      email: this.email,

      password: this.password

    }).subscribe({

      //  SUCCESS
      next: (response) => {

        console.log(
          'USUARIO CREADO =>',
          response
        );

        // STOP LOADING
        this.loading = false;

        // SUCCESS MESSAGE
        this.success =
          'Usuario creado correctamente';

        // CLEAR FORM
        this.name = '';
        this.email = '';
        this.password = '';

        // REDIRECT
        setTimeout(() => {

          this.router.navigate(['/login']);

        }, 1500);
      },

      //  ERROR
      error: (err) => {

        console.log(
          'REGISTER ERROR =>',
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
            'No se pudo crear el usuario';
        }
      }
    });
  }

  // GO TO LOGIN
  goToLogin(): void {

    this.router.navigate(['/login']);
  }
}
