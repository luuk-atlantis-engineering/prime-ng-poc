import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  DateRange, 
  SchedulerViewState, 
  SchedulerViewType 
} from '../models/scheduler.models';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  private _viewState = new BehaviorSubject<SchedulerViewState>({
    viewType: SchedulerViewType.Week,
    currentDate: new Date(),
    showWeekends: true
  });

  viewState$ = this._viewState.asObservable();

  constructor() { }

  getCurrentViewState(): SchedulerViewState {
    return this._viewState.getValue();
  }

  setViewType(viewType: SchedulerViewType): void {
    const currentState = this._viewState.getValue();
    this._viewState.next({
      ...currentState,
      viewType
    });
  }

  setCurrentDate(date: Date): void {
    const currentState = this._viewState.getValue();
    this._viewState.next({
      ...currentState,
      currentDate: new Date(date)
    });
  }

  toggleWeekends(): void {
    const currentState = this._viewState.getValue();
    this._viewState.next({
      ...currentState,
      showWeekends: !currentState.showWeekends
    });
  }

  goToNextPeriod(): void {
    const { viewType, currentDate } = this._viewState.getValue();
    const newDate = new Date(currentDate);
    
    if (viewType === SchedulerViewType.Week) {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    
    this.setCurrentDate(newDate);
  }

  goToPreviousPeriod(): void {
    const { viewType, currentDate } = this._viewState.getValue();
    const newDate = new Date(currentDate);
    
    if (viewType === SchedulerViewType.Week) {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    
    this.setCurrentDate(newDate);
  }

  goToToday(): void {
    this.setCurrentDate(new Date());
  }

  getCurrentViewRange(): DateRange {
    const { viewType, currentDate, showWeekends } = this._viewState.getValue();
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    
    if (viewType === SchedulerViewType.Week) {
      // Set start to Monday of current week
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      
      // Set end to Friday or Sunday based on showWeekends
      end.setDate(start.getDate() + (showWeekends ? 6 : 4));
    } else {
      // Set start to first day of month
      start.setDate(1);
      
      // Set end to last day of month
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    }
    
    // Reset hours, minutes, seconds, and milliseconds
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    return { start, end };
  }
} 