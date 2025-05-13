import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SchedulerService } from '../../services/scheduler.service';
import { DateUtilsService } from '../../utils/date-utils.service';
import { DateRange, SchedulerViewState, SchedulerViewType } from '../../models/scheduler.models';

@Component({
  selector: 'app-calendar-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectButtonModule,
    ToggleButtonModule,
    TranslatePipe
  ],
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss']
})
export class CalendarHeaderComponent implements OnInit, OnDestroy {
  viewState!: SchedulerViewState;
  dateRangeLabel: string = '';
  viewOptions = [
    { label: 'Week', value: SchedulerViewType.Week },
    { label: 'Month', value: SchedulerViewType.Month }
  ];
  
  private destroy$ = new Subject<void>();

  constructor(
    private schedulerService: SchedulerService,
    private dateUtils: DateUtilsService
  ) {}

  ngOnInit(): void {
    this.schedulerService.viewState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(viewState => {
        this.viewState = viewState;
        this.updateDateRangeLabel();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateDateRangeLabel(): void {
    const range = this.schedulerService.getCurrentViewRange();
    this.dateRangeLabel = this.dateUtils.formatDateRange(range);
  }

  onViewTypeChange(viewType: SchedulerViewType): void {
    this.schedulerService.setViewType(viewType);
  }

  onToggleWeekends(): void {
    this.schedulerService.toggleWeekends();
  }

  goToPrevious(): void {
    this.schedulerService.goToPreviousPeriod();
  }

  goToNext(): void {
    this.schedulerService.goToNextPeriod();
  }

  goToToday(): void {
    this.schedulerService.goToToday();
  }
} 