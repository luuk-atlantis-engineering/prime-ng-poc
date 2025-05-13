import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
// Import Chart.js to ensure it's available for PrimeNG Chart component
import 'chart.js/auto';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
