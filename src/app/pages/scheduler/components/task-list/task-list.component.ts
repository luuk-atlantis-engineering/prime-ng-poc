import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Task } from '../../models/scheduler.models';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TranslatePipe } from '@ngx-translate/core';

interface CategoryOption {
  label: string;
  value: string;
  color: string;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskItemComponent,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    TranslatePipe
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  displayTaskDialog = false;
  editMode = false;
  
  // For task dialog
  currentTask: Partial<Task> = {};
  categoryOptions: CategoryOption[] = [
    { label: 'Meeting', value: 'Meeting', color: '#4caf50' },
    { label: 'Call', value: 'Call', color: '#2196f3' },
    { label: 'Work', value: 'Work', color: '#9c27b0' },
    { label: 'Personal', value: 'Personal', color: '#ff9800' },
    { label: 'Other', value: 'Other', color: '#9e9e9e' }
  ];
  
  private destroy$ = new Subject<void>();
  
  constructor(private taskService: TaskService) {}
  
  ngOnInit(): void {
    this.taskService.getUnscheduledTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.tasks = tasks;
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  openNewTaskDialog(): void {
    this.currentTask = {};
    this.editMode = false;
    this.displayTaskDialog = true;
  }
  
  onEditTask(task: Task): void {
    this.currentTask = { ...task };
    this.editMode = true;
    this.displayTaskDialog = true;
  }
  
  onDeleteTask(task: Task): void {
    // In a real app, you might want to add a confirmation dialog here
    // For now, we'll just log it
    console.log('Delete task:', task);
  }
  
  saveTask(): void {
    if (!this.currentTask.title?.trim()) {
      return;
    }
    
    if (this.editMode && this.currentTask.id) {
      // If editing, update existing task
      // In a real app, you'd implement the update logic in the task service
      console.log('Update task:', this.currentTask);
    } else {
      // If new, add task
      this.taskService.addTask(this.currentTask).subscribe(task => {
        console.log('Task added:', task);
      });
    }
    
    this.hideDialog();
  }
  
  hideDialog(): void {
    this.displayTaskDialog = false;
    this.currentTask = {};
  }
  
  onCategoryChange(category: string): void {
    const categoryOption = this.categoryOptions.find(opt => opt.value === category);
    if (categoryOption) {
      this.currentTask.color = categoryOption.color;
    }
  }
} 