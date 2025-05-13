import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './layout/topbar/topbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    styleUrl: './app.component.css',
    imports: [
      RouterOutlet,
      TopbarComponent
    ]
})
export class AppComponent {
  title = 'Abe.Aimms.Core.Client';
}
