import { Directive, ElementRef, HostListener, Input, Renderer2, OnInit } from '@angular/core';
import { DragDropService } from '../services/drag-drop.service';
import { Task } from '../models/scheduler.models';

@Directive({
  selector: '[appDraggable]',
  standalone: true
})
export class DraggableDirective implements OnInit {
  @Input() task!: Task;
  private isDragging = false;
  private initialX = 0;
  private initialY = 0;
  private clone: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private dragDropService: DragDropService
  ) {}

  ngOnInit(): void {
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    // Prevent default behavior to avoid text selection
    event.preventDefault();
    
    // Start tracking drag state
    this.isDragging = true;
    this.initialX = event.clientX;
    this.initialY = event.clientY;
    
    // Change cursor to grabbing
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grabbing');
    
    // Create a clone of the element for dragging
    this.clone = this.el.nativeElement.cloneNode(true) as HTMLElement;
    this.renderer.setStyle(this.clone, 'position', 'fixed');
    this.renderer.setStyle(this.clone, 'left', `${event.clientX}px`);
    this.renderer.setStyle(this.clone, 'top', `${event.clientY}px`);
    this.renderer.setStyle(this.clone, 'width', `${this.el.nativeElement.offsetWidth}px`);
    this.renderer.setStyle(this.clone, 'z-index', '1000');
    this.renderer.setStyle(this.clone, 'opacity', '0.7');
    this.renderer.setStyle(this.clone, 'pointer-events', 'none');
    this.renderer.appendChild(document.body, this.clone);
    
    // Notify the service that drag has started
    this.dragDropService.startDrag(this.task);
    
    // Add global event listeners for mouse move and mouse up
    this.renderer.listen('document', 'mousemove', this.onMouseMove.bind(this));
    this.renderer.listen('document', 'mouseup', this.onMouseUp.bind(this));
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.clone) return;
    
    // Move the clone to follow the mouse
    this.renderer.setStyle(this.clone, 'left', `${event.clientX - 20}px`);
    this.renderer.setStyle(this.clone, 'top', `${event.clientY - 20}px`);
  }

  onMouseUp(event: MouseEvent): void {
    if (!this.isDragging) return;
    
    // End dragging state
    this.isDragging = false;
    
    // Reset cursor
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
    
    // Remove the clone
    if (this.clone) {
      this.renderer.removeChild(document.body, this.clone);
      this.clone = null;
    }
    
    // Notify the service that drag has ended
    this.dragDropService.endDrag();
  }
} 