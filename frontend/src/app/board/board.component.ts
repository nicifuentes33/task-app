import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../core/services/task.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  //  FORM
  title = '';
  description = '';
  dueDate = '';
  priority = 'Baja';

  //  FILTERS
  search = '';
  filterStatus = 'Todos';
  filterPriority = 'Todas';

  //  EDIT
  editingTask: any = null;

  // LIMITS
  pendingLimit = 5;
  progressLimit = 5;
  completedLimit = 5;

  //  TASKS
  tasks: any[] = [];

  constructor(
   private auth: AuthService,
private taskService: TaskService,
private router: Router
  ) {}
loadTasks(): void {

  this.taskService.getTasks().subscribe({
    next: (data: any) => {
      this.tasks = data;
      this.sortTasksByDate();
    },
    error: (err) => {
      console.log('ERROR LOAD TASKS =>', err);
    }
  });
}
  //  INIT
  ngOnInit(): void {

    if (!this.auth.isLoggedIn()) {

      this.router.navigate(['/login']);
    }

//  TASKS
this.tasks = [];
this.loadTasks();

    // SORT INITIAL TASKS
    this.sortTasksByDate();
  }

  //  LOGOUT
  logout(): void {

    this.auth.logout();

    this.router.navigate(['/login']);
  }

  //  CREATE OR SAVE TASK
  saveTask(): void {

    // VALIDATE FIELDS
    if (

      this.title.trim() === '' ||

      this.description.trim() === '' ||

      this.dueDate === '' ||

      this.priority === ''

    ) {

      alert('Debes completar todos los campos');

      return;
    }

    //  EDIT TASK
    if (this.editingTask) {

      this.editingTask.title = this.title;

      this.editingTask.description = this.description;

      this.editingTask.dueDate = this.dueDate;

      this.editingTask.priority = this.priority;

      //  SORT
      this.sortTasksByDate();

      this.cancelEdit();

      return;
    }

    // CREATE TASK
    const newTask = {

      id: Date.now(),

      title: this.title,

      description: this.description,

      dueDate: this.dueDate,

      priority: this.priority,

      status: 'Pendiente'
    };

    this.taskService.createTask(newTask).subscribe({
  next: () => this.loadTasks(),
  error: (err) => console.log(err)
});

    // SORT TASKS
    this.sortTasksByDate();

    // CLEAR FORM
    this.title = '';

    this.description = '';

    this.dueDate = '';

    this.priority = 'Baja';
  }

  //  CANCEL EDIT
  cancelEdit(): void {

    this.editingTask = null;

    //  CLEAR FORM
    this.title = '';

    this.description = '';

    this.dueDate = '';

    this.priority = 'Baja';
  }

  //  LOAD TASK TO EDIT
  loadTaskToEdit(task: any): void {

    this.editingTask = task;

    this.title = task.title;

    this.description = task.description;

    this.dueDate = task.dueDate;

    this.priority = task.priority;
  }

  //  DELETE TASK
  deleteTask(id: string): void {

    this.taskService.deleteTask(id).subscribe({
  next: () => this.loadTasks(),
  error: (err) => console.log(err)
});
  }

nextStatus(task: any): void {

  let newStatus = task.status;

  if (task.status === 'Pendiente') {
    newStatus = 'En progreso';
  }
  else if (task.status === 'En progreso') {
    newStatus = 'Completado';
  }

  const updatedTask = {
    ...task,
    status: newStatus
  };

  this.taskService.updateTask(task._id, updatedTask).subscribe({
    next: () => {
      this.loadTasks();
    },
    error: (err) => {
      console.log('STATUS UPDATE ERROR =>', err);
    }
  });
}

  // FILTER TASKS
  getFilteredTasks(status: string): any[] {

    return this.tasks.filter(task => {

      //  STATUS COLUMN
      const matchesStatus =

        task.status === status;

      // SEARCH
      const matchesSearch =

        task.title
          .toLowerCase()
          .includes(this.search.toLowerCase())

        ||

        task.description
          .toLowerCase()
          .includes(this.search.toLowerCase());

      //  PRIORITY FILTER
      const matchesPriority =

        this.filterPriority === 'Todas'

        ||

        task.priority === this.filterPriority;

      //  STATUS FILTER
      const matchesFilterStatus =

        this.filterStatus === 'Todos'

        ||

        task.status === this.filterStatus;

      return (

        matchesStatus &&

        matchesSearch &&

        matchesPriority &&

        matchesFilterStatus
      );
    });
  }

// SHOW MORE / LESS
showMore(status: string): void {

  // PENDIENTE
  if (status === 'Pendiente') {

    const total =
      this.getFilteredTasks('Pendiente').length;

    if (this.pendingLimit >= total) {
      this.pendingLimit = 5;
    }

    else {
      this.pendingLimit = total;
    }
  }

  //  EN PROGRESO
  else if (status === 'En progreso') {

    const total =
      this.getFilteredTasks('En progreso').length;

    if (this.progressLimit >= total) {
      this.progressLimit = 5;
    }

    else {
      this.progressLimit = total;
    }
  }

  // COMPLETADO
  else if (status === 'Completado') {

    const total =
      this.getFilteredTasks('Completado').length;

    if (this.completedLimit >= total) {
      this.completedLimit = 5;
    }

    else {
      this.completedLimit = total;
    }
  }
}
  //  SORT TASKS BY DATE
  sortTasksByDate(): void {

    this.tasks.sort((a, b) => {

      return (

        new Date(a.dueDate).getTime()

        -

        new Date(b.dueDate).getTime()
      );
    });
  }
}
