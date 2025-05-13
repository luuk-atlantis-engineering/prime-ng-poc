export enum SchedulerViewType {
  Week = 'week',
  Month = 'month'
}

export interface SchedulerViewState {
  viewType: SchedulerViewType;
  currentDate: Date;
  showWeekends: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string;
  color?: string;
}

export interface ScheduledTask extends Task {
  startTime: Date;
  endTime: Date;
  isAllDay?: boolean;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface TimeSlot {
  time: Date;
  isOccupied: boolean;
}

export interface DayViewData {
  date: Date;
  dayName: string;
  isToday: boolean;
  isWeekend: boolean;
  tasks: ScheduledTask[];
  timeSlots?: TimeSlot[];
} 