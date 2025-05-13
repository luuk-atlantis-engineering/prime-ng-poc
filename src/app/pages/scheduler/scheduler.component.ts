import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { DayViewComponent } from './components/day-view/day-view.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { SchedulerService } from './services/scheduler.service';
import { TaskService } from './services/task.service';
import { DateUtilsService } from './utils/date-utils.service';
import { DragDropService } from './services/drag-drop.service';
import { 
  DateRange, 
  DayViewData, 
  ScheduledTask, 
  SchedulerViewState, 
  SchedulerViewType,
  Task
} from './models/scheduler.models';

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    CalendarHeaderComponent,
    DayViewComponent,
    TaskListComponent
  ],
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit, OnDestroy {
  viewState!: SchedulerViewState;
  dayViewData: DayViewData[] = [];
  timeSlots: Date[] = [];
  currentDateRange!: DateRange;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private schedulerService: SchedulerService,
    private taskService: TaskService,
    private dateUtils: DateUtilsService,
    private dragDropService: DragDropService
  ) {}

  ngOnInit(): void {
    // Subscribe to view state changes
    this.schedulerService.viewState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(viewState => {
        this.viewState = viewState;
        this.currentDateRange = this.schedulerService.getCurrentViewRange();
        this.updateView();
      });
    
    // Generate time slots (8 AM to 6 PM)
    this.timeSlots = this.dateUtils.getTimeSlots(8, 18, 30);
    
    // Listen for drag events
    this.dragDropService.dragState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        // You can add visual cues or other logic when dragging
        if (state.isDragging) {
          console.log('Dragging task:', state.draggedTask?.title);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateView(): void {
    if (this.viewState.viewType === SchedulerViewType.Week) {
      this.updateWeekView();
    } else {
      this.updateMonthView();
    }
  }

  updateWeekView(): void {
    // Get dates for the week
    const dates = this.dateUtils.getWeekDates(
      this.viewState.currentDate, 
      this.viewState.showWeekends
    );
    
    // Initialize day view data for each date
    this.dayViewData = dates.map(date => this.dateUtils.createDayViewData(date));
    
    // Load tasks for the date range
    this.loadTasksForDateRange();
  }

  updateMonthView(): void {
    // Get dates for the month
    const dates = this.dateUtils.getMonthDates(this.viewState.currentDate);
    
    // Initialize day view data for each date
    this.dayViewData = dates.map(date => this.dateUtils.createDayViewData(date));
    
    // Load tasks for the date range
    this.loadTasksForDateRange();
  }

  loadTasksForDateRange(): void {
    this.taskService.getTasksInRange(this.currentDateRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        // Reset tasks in all days
        this.dayViewData.forEach(day => day.tasks = []);
        
        // Distribute tasks to the appropriate days
        tasks.forEach(task => {
          const taskDate = new Date(task.startTime);
          const dayIndex = this.dayViewData.findIndex(day => 
            day.date.getDate() === taskDate.getDate() &&
            day.date.getMonth() === taskDate.getMonth() &&
            day.date.getFullYear() === taskDate.getFullYear()
          );
          
          if (dayIndex !== -1) {
            this.dayViewData[dayIndex].tasks.push(task);
          }
        });
      });
  }

  onTaskDropped(data: { task: ScheduledTask | Task, date: Date }): void {
    // Handle task dropping logic
    const dragState = this.dragDropService.getCurrentDragState();
    const draggedTask = dragState.draggedTask;
    
    if (!draggedTask) {
      return;
    }
    
    // Check if the task is a ScheduledTask (already on calendar)
    if ('startTime' in draggedTask && 'endTime' in draggedTask) {
      // It's a reschedule (move) operation
      this.dragDropService.handleMove(draggedTask as ScheduledTask, data.date)
        .subscribe(updatedTask => {
          console.log('Task moved:', updatedTask);
          this.updateView(); // Refresh view to reflect changes
        });
    } else {
      // It's a new scheduling operation
      this.dragDropService.handleDrop(draggedTask, data.date)
        .subscribe(scheduledTask => {
          if (scheduledTask) {
            console.log('Task scheduled:', scheduledTask);
            this.updateView(); // Refresh view to reflect changes
          }
        });
    }
  }
} 