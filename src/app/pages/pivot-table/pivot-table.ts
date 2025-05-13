import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PivotTableComponent } from './pivot-table.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PivotTableComponent
      }
    ])
  ]
})
export class PivotTableModule {} 