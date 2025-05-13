import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateRange, ScheduledTask, Task } from '../models/scheduler.models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // In a real application, this would come from an API
  private _tasks = new BehaviorSubject<ScheduledTask[]>([
    {
      id: '1',
      title: 'Project Meeting',
      description: 'Discuss project timeline',
      startTime: new Date(new Date().setHours(10, 0, 0, 0)),
      endTime: new Date(new Date().setHours(11, 0, 0, 0)),
      category: 'Meeting',
      color: '#4caf50'
    },
    {
      id: '2',
      title: 'Client Call',
      description: 'Quarterly review with client',
      startTime: new Date(new Date().setHours(14, 0, 0, 0)),
      endTime: new Date(new Date().setHours(15, 30, 0, 0)),
      category: 'Call',
      color: '#2196f3'
    },
    {
      id: '3',
      title: 'Team Lunch',
      description: 'Team building lunch',
      startTime: this.createDateWithOffset(1, 12, 0),
      endTime: this.createDateWithOffset(1, 13, 0),
      category: 'Personal',
      color: '#ff9800'
    }
  ]);

  private _unscheduledTasks = new BehaviorSubject<Task[]>([
    {
      id: '4',
      title: 'Review Documentation',
      description: 'Review project documentation',
      category: 'Work',
      color: '#9c27b0'
    },
    {
      id: '5',
      title: 'Prepare Presentation',
      description: 'Create slides for next week',
      category: 'Work',
      color: '#e91e63'
    }
  ]);

  tasks$ = this._tasks.asObservable();
  unscheduledTasks$ = this._unscheduledTasks.asObservable();

  constructor() { }

  // Helper method to create dates with offset from today
  private createDateWithOffset(dayOffset: number, hours: number, minutes: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  getTasksInRange(range: DateRange): Observable<ScheduledTask[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => 
        task.startTime >= range.start && task.startTime <= range.end
      ))
    );
  }

  getTasksForDate(date: Date): Observable<ScheduledTask[]> {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    return this.getTasksInRange({ start: dayStart, end: dayEnd });
  }

  getUnscheduledTasks(): Observable<Task[]> {
    return this.unscheduledTasks$;
  }

  addTask(task: Partial<Task>): Observable<Task> {
    const newTask: Task = {
      id: uuidv4(),
      title: task.title || 'New Task',
      description: task.description,
      category: task.category,
      color: task.color || '#9e9e9e'
    };
    
    const currentTasks = this._unscheduledTasks.getValue();
    this._unscheduledTasks.next([...currentTasks, newTask]);
    
    return of(newTask);
  }

  scheduleTask(taskId: string, startTime: Date, endTime: Date): Observable<ScheduledTask | null> {
    const unscheduledTasks = this._unscheduledTasks.getValue();
    const taskIndex = unscheduledTasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return of(null);
    }
    
    const task = unscheduledTasks[taskIndex];
    const scheduledTask: ScheduledTask = {
      ...task,
      startTime,
      endTime
    };
    
    // Remove from unscheduled tasks
    const updatedUnscheduledTasks = [
      ...unscheduledTasks.slice(0, taskIndex),
      ...unscheduledTasks.slice(taskIndex + 1)
    ];
    this._unscheduledTasks.next(updatedUnscheduledTasks);
    
    // Add to scheduled tasks
    const scheduledTasks = this._tasks.getValue();
    this._tasks.next([...scheduledTasks, scheduledTask]);
    
    return of(scheduledTask);
  }

  updateScheduledTask(task: ScheduledTask): Observable<ScheduledTask> {
    const tasks = this._tasks.getValue();
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    
    if (taskIndex === -1) {
      return of(task);
    }
    
    const updatedTasks = [
      ...tasks.slice(0, taskIndex),
      task,
      ...tasks.slice(taskIndex + 1)
    ];
    
    this._tasks.next(updatedTasks);
    return of(task);
  }

  removeScheduledTask(taskId: string): Observable<boolean> {
    const tasks = this._tasks.getValue();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return of(false);
    }
    
    const updatedTasks = [
      ...tasks.slice(0, taskIndex),
      ...tasks.slice(taskIndex + 1)
    ];
    
    this._tasks.next(updatedTasks);
    return of(true);
  }
} 