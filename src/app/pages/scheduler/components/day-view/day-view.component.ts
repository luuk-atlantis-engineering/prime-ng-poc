import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayViewData, ScheduledTask } from '../../models/scheduler.models';
import { DateUtilsService } from '../../utils/date-utils.service';
import { DroppableDirective } from '../../directives/droppable.directive';
import { DraggableDirective } from '../../directives/draggable.directive';
import { TooltipModule } from 'primeng/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [
    CommonModule,
    DroppableDirective,
    DraggableDirective,
    TooltipModule,
    TranslatePipe
  ],
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss']
})
export class DayViewComponent implements OnChanges {
  @Input() dayData!: DayViewData;
  @Input() timeSlots: Date[] = [];
  @Output() taskDropped = new EventEmitter<{ task: ScheduledTask, date: Date }>();
  
  constructor(private dateUtils: DateUtilsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // If needed, refresh data when inputs change
  }

  getTimeLabel(date: Date): string {
    return this.dateUtils.formatTime(date);
  }

  onTaskDropped(date: Date): void {
    // This is triggered when a task is dropped onto a time slot
    this.taskDropped.emit({ task: {} as ScheduledTask, date });
  }

  onTaskClick(task: ScheduledTask): void {
    // We could emit an event for task editing
    console.log('Task clicked:', task);
  }

  getTaskPosition(task: ScheduledTask): { top: string, height: string } {
    // Calculate position based on time
    // This is a simple implementation; you'd want more sophisticated logic
    // for handling overlapping tasks, multi-day tasks, etc.
    const dayStart = new Date(this.dayData.date);
    dayStart.setHours(0, 0, 0, 0);
    
    const taskStart = new Date(task.startTime);
    const taskEnd = new Date(task.endTime);
    
    // Calculate minutes from day start to task start
    const dayStartMinutes = dayStart.getHours() * 60 + dayStart.getMinutes();
    const taskStartMinutes = taskStart.getHours() * 60 + taskStart.getMinutes();
    const taskEndMinutes = taskEnd.getHours() * 60 + taskEnd.getMinutes();
    
    // Calculate task duration in minutes
    const taskDuration = taskEndMinutes - taskStartMinutes;
    
    // Calculate top position percentage (relative to 24 hours)
    const topPercentage = ((taskStartMinutes - dayStartMinutes) / (24 * 60)) * 100;
    
    // Calculate height percentage (relative to 24 hours)
    const heightPercentage = (taskDuration / (24 * 60)) * 100;
    
    return {
      top: `${topPercentage}%`,
      height: `${heightPercentage}%`
    };
  }
} 