import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { DragDropService } from '../services/drag-drop.service';
import { filter, take } from 'rxjs/operators';

@Directive({
  selector: '[appDroppable]',
  standalone: true
})
export class DroppableDirective {
  @Input() timeSlot!: Date;
  @Output() taskDropped = new EventEmitter<Date>();
  private isOver = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private dragDropService: DragDropService
  ) {
    // Subscribe to drag state changes
    this.dragDropService.dragState$
      .pipe(
        filter(state => state.isDragging)
      )
      .subscribe(state => {
        // If drag ends while over this element, handle the drop
        if (!state.isDragging && this.isOver && state.draggedTask) {
          this.taskDropped.emit(this.timeSlot);
        }
      });
  }

  @HostListener('dragenter', ['$event'])
  @HostListener('mouseover', ['$event'])
  onDragEnter(event: Event): void {
    // Check if we're currently dragging
    this.dragDropService.dragState$
      .pipe(
        take(1),
        filter(state => state.isDragging)
      )
      .subscribe(state => {
        this.isOver = true;
        
        // Apply highlight styles
        this.renderer.addClass(this.el.nativeElement, 'drop-target');
        
        // Update drop target in service
        this.dragDropService.updateDropTarget(this.timeSlot);
      });
  }

  @HostListener('dragleave', ['$event'])
  @HostListener('mouseout', ['$event'])
  onDragLeave(event: Event): void {
    this.isOver = false;
    
    // Remove highlight styles
    this.renderer.removeClass(this.el.nativeElement, 'drop-target');
    
    // Clear drop target if it's this element
    this.dragDropService.dragState$
      .pipe(take(1))
      .subscribe(state => {
        if (state.dropTarget === this.timeSlot) {
          this.dragDropService.updateDropTarget(null);
        }
      });
  }

  @HostListener('drop', ['$event'])
  @HostListener('mouseup', ['$event'])
  onDrop(event: Event): void {
    // Prevent default browser behavior (important for drag & drop)
    event.preventDefault();
    
    this.dragDropService.dragState$
      .pipe(
        take(1),
        filter(state => state.isDragging && state.draggedTask !== null)
      )
      .subscribe(state => {
        // Emit the drop event with the time slot
        this.taskDropped.emit(this.timeSlot);
        
        // Remove highlight styles
        this.renderer.removeClass(this.el.nativeElement, 'drop-target');
        
        // Reset state
        this.isOver = false;
      });
  }
} 