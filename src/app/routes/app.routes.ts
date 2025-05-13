import { Routes } from '@angular/router';
import { WarehouseComponent } from '../pages/warehouse/warehouse.component';
import { DynamicFormTestComponent } from '../pages/dynamic-form-test/dynamic-form-test.component';
import { DataTableTestComponent } from '../pages/data-table-test/data-table-test.component';
import { JustAFormComponent } from '../pages/just-a-form/just-a-form.component';
import { PivotTableComponent } from '../pages/pivot-table/pivot-table.component';
import { SchedulerComponent } from '../pages/scheduler/scheduler.component';

export const routes: Routes = [
  {
    path: 'warehouse',
    component: WarehouseComponent
  },
  {
    path: 'dynamic-form-test',
    component: DynamicFormTestComponent
  },
  {
    path: 'data-table-test',
    component: DataTableTestComponent
  },
  {
    path: 'just-a-form',
    component: JustAFormComponent
  },
  {
    path: 'pivot-table',
    component: PivotTableComponent
  },
  {
    path: 'scheduler',
    component: SchedulerComponent
  },
  {
    path: '**',
    redirectTo: '/warehouse'
  }
];
