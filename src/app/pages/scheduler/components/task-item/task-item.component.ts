import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/scheduler.models';
import { DraggableDirective } from '../../directives/draggable.directive';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, DraggableDirective, ButtonModule, TooltipModule, TranslatePipe],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();

  onEditClick(event: Event): void {
    event.stopPropagation();
    this.editTask.emit(this.task);
  }

  onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.deleteTask.emit(this.task);
  }
} 