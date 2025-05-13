import { Injectable } from '@angular/core';
import { DateRange, DayViewData } from '../models/scheduler.models';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {
  constructor() { }

  /**
   * Get array of dates for a week view
   * @param currentDate The reference date
   * @param includeWeekends Whether to include Saturday and Sunday
   * @returns Array of dates for the week
   */
  getWeekDates(currentDate: Date, includeWeekends: boolean): Date[] {
    const dates: Date[] = [];
    const startDate = this.getStartOfWeek(currentDate);
    
    const daysToShow = includeWeekends ? 7 : 5;
    
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  }

  /**
   * Get array of dates for a month view
   * @param currentDate The reference date
   * @returns Array of dates for the month
   */
  getMonthDates(currentDate: Date): Date[] {
    const dates: Date[] = [];
    
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Get the first day to display (might be from the previous month)
    const firstDayToShow = this.getStartOfWeek(firstDayOfMonth);
    
    // Get the last day to display (might be from the next month)
    const lastDayOfLastWeek = this.getEndOfWeek(lastDayOfMonth);
    
    // Generate all dates between firstDayToShow and lastDayOfLastWeek
    const currentDate1 = new Date(firstDayToShow);
    while (currentDate1 <= lastDayOfLastWeek) {
      dates.push(new Date(currentDate1));
      currentDate1.setDate(currentDate1.getDate() + 1);
    }
    
    return dates;
  }

  /**
   * Get the start of the week (Monday) for a given date
   * @param date Reference date
   * @returns Date object representing the start of the week
   */
  getStartOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
    
    const startOfWeek = new Date(date);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    return startOfWeek;
  }

  /**
   * Get the end of the week (Sunday) for a given date
   * @param date Reference date
   * @returns Date object representing the end of the week
   */
  getEndOfWeek(date: Date): Date {
    const startOfWeek = this.getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return endOfWeek;
  }

  /**
   * Check if a date is today
   * @param date Date to check
   * @returns True if the date is today
   */
  isToday(date: Date): boolean {
    const today = new Date();
    
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  /**
   * Check if a date is a weekend day (Saturday or Sunday)
   * @param date Date to check
   * @returns True if the date is a weekend day
   */
  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  }

  /**
   * Format a date as a day name (e.g., "Mon")
   * @param date Date to format
   * @param format Short or long format
   * @returns Formatted day name
   */
  formatDayName(date: Date, format: 'short' | 'long' = 'short'): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: format
    };
    
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Format a date as a month name (e.g., "January")
   * @param date Date to format
   * @param format Short or long format
   * @returns Formatted month name
   */
  formatMonthName(date: Date, format: 'short' | 'long' = 'long'): string {
    const options: Intl.DateTimeFormatOptions = {
      month: format
    };
    
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Format time (e.g., "09:00 AM")
   * @param date Date to format
   * @returns Formatted time string
   */
  formatTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    
    return date.toLocaleTimeString('en-US', options);
  }

  /**
   * Get an array of time slots for a day
   * @param startHour Start hour (e.g., 8 for 8:00 AM)
   * @param endHour End hour (e.g., 18 for 6:00 PM)
   * @param intervalMinutes Interval in minutes (e.g., 30 for half-hour slots)
   * @param date Base date
   * @returns Array of Date objects representing time slots
   */
  getTimeSlots(
    startHour: number = 8,
    endHour: number = 18,
    intervalMinutes: number = 30,
    date: Date = new Date()
  ): Date[] {
    const slots: Date[] = [];
    const baseDate = new Date(date);
    baseDate.setHours(0, 0, 0, 0);
    
    const totalMinutes = (endHour - startHour) * 60;
    const totalSlots = totalMinutes / intervalMinutes;
    
    for (let i = 0; i <= totalSlots; i++) {
      const slotDate = new Date(baseDate);
      const minutes = startHour * 60 + i * intervalMinutes;
      
      slotDate.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
      slots.push(slotDate);
    }
    
    return slots;
  }

  /**
   * Create day view data for a specific date
   * @param date The date to create view data for
   * @returns DayViewData object
   */
  createDayViewData(date: Date): DayViewData {
    return {
      date: new Date(date),
      dayName: this.formatDayName(date, 'short'),
      isToday: this.isToday(date),
      isWeekend: this.isWeekend(date),
      tasks: []
    };
  }

  /**
   * Get a formatted date range string
   * @param range DateRange object
   * @returns Formatted date range string
   */
  formatDateRange(range: DateRange): string {
    const { start, end } = range;
    
    // Same month and year
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()} - ${end.getDate()} ${this.formatMonthName(start)} ${start.getFullYear()}`;
    }
    
    // Same year
    if (start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()} ${this.formatMonthName(start, 'short')} - ${end.getDate()} ${this.formatMonthName(end, 'short')} ${start.getFullYear()}`;
    }
    
    // Different years
    return `${start.getDate()} ${this.formatMonthName(start, 'short')} ${start.getFullYear()} - ${end.getDate()} ${this.formatMonthName(end, 'short')} ${end.getFullYear()}`;
  }
} 