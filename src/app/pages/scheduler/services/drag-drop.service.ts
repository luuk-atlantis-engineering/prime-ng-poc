import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task, ScheduledTask } from '../models/scheduler.models';
import { TaskService } from './task.service';

export interface DragState {
  isDragging: boolean;
  draggedTask: Task | null;
  dropTarget: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class DragDropService {
  private _dragState = new BehaviorSubject<DragState>({
    isDragging: false,
    draggedTask: null,
    dropTarget: null
  });

  dragState$ = this._dragState.asObservable();

  constructor(private taskService: TaskService) { }

  // Get the current drag state
  getCurrentDragState(): DragState {
    return this._dragState.getValue();
  }

  startDrag(task: Task): void {
    this._dragState.next({
      isDragging: true,
      draggedTask: task,
      dropTarget: null
    });
  }

  updateDropTarget(target: Date | null): void {
    const currentState = this._dragState.getValue();
    
    this._dragState.next({
      ...currentState,
      dropTarget: target
    });
  }

  endDrag(): void {
    this._dragState.next({
      isDragging: false,
      draggedTask: null,
      dropTarget: null
    });
  }

  /**
   * Handle dropping a task on a calendar slot
   * @param task The task being dragged
   * @param date The date/time where the task is dropped
   * @param duration Duration in minutes (default 60 minutes)
   * @returns Observable of the scheduled task or null if operation failed
   */
  handleDrop(task: Task, date: Date, duration: number = 60): Observable<ScheduledTask | null> {
    const startTime = new Date(date);
    const endTime = new Date(date);
    endTime.setMinutes(startTime.getMinutes() + duration);
    
    // End drag state
    this.endDrag();
    
    return this.taskService.scheduleTask(task.id, startTime, endTime);
  }

  /**
   * Handle moving a scheduled task to a new time
   * @param task The scheduled task to move
   * @param newStartTime The new start time
   * @returns Observable of the updated scheduled task
   */
  handleMove(task: ScheduledTask, newStartTime: Date): Observable<ScheduledTask> {
    // Calculate the task duration in milliseconds
    const duration = task.endTime.getTime() - task.startTime.getTime();
    
    // Create new end time based on the same duration
    const newEndTime = new Date(newStartTime.getTime() + duration);
    
    // Create updated task
    const updatedTask: ScheduledTask = {
      ...task,
      startTime: newStartTime,
      endTime: newEndTime
    };
    
    // End drag state
    this.endDrag();
    
    return this.taskService.updateScheduledTask(updatedTask);
  }

  /**
   * Check if a time slot is available for scheduling
   * @param date The date/time to check
   * @param duration Duration in minutes
   * @param excludeTaskId Optional task ID to exclude from collision check
   * @returns Promise that resolves to true if slot is available
   */
  async isTimeSlotAvailable(
    date: Date, 
    duration: number = 60, 
    excludeTaskId?: string
  ): Promise<boolean> {
    // Calculate potential end time
    const startTime = new Date(date);
    const endTime = new Date(date);
    endTime.setMinutes(startTime.getMinutes() + duration);
    
    // Create a date range for conflict checking
    const range = {
      start: startTime,
      end: endTime
    };
    
    // Get all tasks for this day
    const tasksForDay = await new Promise<ScheduledTask[]>((resolve) => {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      this.taskService.getTasksInRange({ start: dayStart, end: dayEnd }).subscribe(tasks => {
        resolve(tasks);
      });
    });
    
    // Check for conflicts
    return !tasksForDay.some(task => {
      // Skip task if it's the one being moved
      if (excludeTaskId && task.id === excludeTaskId) {
        return false;
      }
      
      // Check for overlap
      const taskStart = task.startTime;
      const taskEnd = task.endTime;
      
      // There is a conflict if:
      // - The new task starts during an existing task
      // - The new task ends during an existing task
      // - The new task completely overlaps an existing task
      return (
        (startTime >= taskStart && startTime < taskEnd) ||
        (endTime > taskStart && endTime <= taskEnd) ||
        (startTime <= taskStart && endTime >= taskEnd)
      );
    });
  }
} 