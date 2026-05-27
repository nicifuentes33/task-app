import { Injectable } from '@angular/core';

import {

  HttpClient,

  HttpHeaders

} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'https://task-app-bwrl.onrender.com/api/tasks';

  constructor(private http: HttpClient) {}

  // HEADERS
private getHeaders() {

  const token = localStorage.getItem('token');

  if (!token) {
    return {
      headers: new HttpHeaders({})
    };
  }

  return {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  };
}
  // GET
  getTasks(): Observable<any> {

    return this.http.get(
      this.apiUrl,
      this.getHeaders()
    );
  }

  // CREATE
  createTask(task: any): Observable<any> {

    return this.http.post(
      this.apiUrl,
      task,
      this.getHeaders()
    );
  }

  //  UPDATE
 updateTask(id: string, task: any): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      task,
      this.getHeaders()
    );
  }

  //  DELETE
  deleteTask(id: string): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      this.getHeaders()
    );
  }
}
