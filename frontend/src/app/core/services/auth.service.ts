import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  //  REGISTER
  register(user: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/register`,
      user
    );
  }

  //  LOGIN
  login(user: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/login`,
      user
    );
  }

  //  SAVE TOKEN
  saveToken(token: string): void {

    localStorage.setItem('token', token);
  }

  // GET TOKEN
  getToken(): string | null {

    return localStorage.getItem('token');
  }

  //  LOGGED
  isLoggedIn(): boolean {

    return !!localStorage.getItem('token');
  }

  //  LOGOUT
  logout(): void {

    localStorage.removeItem('token');
  }
}
