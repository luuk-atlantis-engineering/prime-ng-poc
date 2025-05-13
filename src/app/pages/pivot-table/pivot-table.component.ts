import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from 'primeng/dragdrop';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

interface SalesData {
  id: number;
  product: string;
  category: string;
  region: string;
  year: number;
  quarter: string;
  sales: number;
  units: number;
}

interface PivotField {
  field: string;
  header: string;
  active: boolean;
}

interface PivotConfig {
  rows: PivotField[];
  columns: PivotField[];
  values: PivotField[];
}

@Component({
  selector: 'app-pivot-table',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    CardModule,
    TableModule,
    DropdownModule,
    SelectButtonModule,
    InputTextModule,
    CheckboxModule,
    FormsModule,
    DragDropModule,
    DialogModule,
    TooltipModule
  ],
  templateUrl: './pivot-table.component.html',
  styleUrls: ['./pivot-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PivotTableComponent {
  rawData: SalesData[] = [];
  pivotData: any[] = [];
  pivotColumns: any[] = [];
  
  isConfiguring = signal(false);
  
  availableFields: PivotField[] = [
    { field: 'product', header: 'Product', active: false },
    { field: 'category', header: 'Category', active: false },
    { field: 'region', header: 'Region', active: false },
    { field: 'year', header: 'Year', active: false },
    { field: 'quarter', header: 'Quarter', active: false },
    { field: 'sales', header: 'Sales', active: false },
    { field: 'units', header: 'Units', active: false }
  ];
  
  pivotConfig: PivotConfig = {
    rows: [
      { field: 'category', header: 'Category', active: true },
      { field: 'product', header: 'Product', active: true }
    ],
    columns: [
      { field: 'region', header: 'Region', active: true },
      { field: 'year', header: 'Year', active: true }
    ],
    values: [
      { field: 'sales', header: 'Sales', active: true },
      { field: 'units', header: 'Units', active: true }
    ]
  };
  
  draggedField: PivotField | null = null;
  selectedValueField = 'sales';
  
  // Getter methods to avoid assignments in templates
  get activeRows(): PivotField[] {
    return this.pivotConfig.rows.filter(field => field.active);
  }
  
  get activeColumns(): PivotField[] {
    return this.pivotConfig.columns.filter(field => field.active);
  }
  
  get activeValues(): PivotField[] {
    return this.pivotConfig.values.filter(field => field.active);
  }
  
  get hasOneActiveColumn(): boolean {
    return this.activeColumns.length === 1;
  }
  
  get emptymessageColspan(): number {
    return this.activeRows.length + this.pivotColumns.length;
  }
  
  constructor() {
    this.generateSampleData();
    this.refreshPivotTable();
  }
  
  generateSampleData() {
    const products = ['Laptop', 'Tablet', 'Phone', 'Monitor', 'Keyboard'];
    const categories = ['Electronics', 'Accessories', 'Peripherals'];
    const regions = ['North', 'South', 'East', 'West'];
    const years = [2021, 2022, 2023];
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    
    let id = 1;
    
    // Generate sample data with all combinations
    for (const product of products) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      for (const region of regions) {
        for (const year of years) {
          for (const quarter of quarters) {
            this.rawData.push({
              id: id++,
              product,
              category,
              region,
              year,
              quarter,
              sales: Math.floor(Math.random() * 10000),
              units: Math.floor(Math.random() * 100)
            });
          }
        }
      }
    }
  }
  
  refreshPivotTable() {
    // Generate pivot data based on current configuration
    this.generatePivotData();
  }
  
  generatePivotData() {
    // In a real application, this would be a complex pivot algorithm
    // For demo purposes, we'll create a simplified version
    
    // Build column headers based on column fields
    const uniqueColumnValues = this.getUniqueColumnValues();
    this.pivotColumns = this.buildColumnHeaders(uniqueColumnValues);
    
    // Group data by row fields
    const rowGroups = this.groupByRowFields();
    
    // Format the pivot data
    this.pivotData = this.formatPivotData(rowGroups, uniqueColumnValues);
  }
  
  private getUniqueColumnValues() {
    const result: any = {};
    
    // Get unique values for each column field
    this.activeColumns.forEach(columnField => {
      result[columnField.field] = Array.from(new Set(
        this.rawData.map(item => item[columnField.field as keyof SalesData])
      )).sort();
    });
    
    return result;
  }
  
  private buildColumnHeaders(uniqueColumnValues: any) {
    // This is a simplified version - in a real app this would be more complex
    // For simplicity, we'll only support up to 2 column fields
    const columns: any[] = [];
    
    if (this.activeColumns.length === 1) {
      const field = this.activeColumns[0].field;
      uniqueColumnValues[field].forEach((value: any) => {
        columns.push({
          field: `${field}_${value}`,
          header: value,
          subHeader: '',
          sortField: value
        });
      });
    } else if (this.activeColumns.length === 2) {
      const field1 = this.activeColumns[0].field;
      const field2 = this.activeColumns[1].field;
      
      uniqueColumnValues[field1].forEach((value1: any) => {
        uniqueColumnValues[field2].forEach((value2: any) => {
          columns.push({
            field: `${field1}_${value1}_${field2}_${value2}`,
            header: value1,
            subHeader: value2,
            sortField: `${value1}_${value2}`
          });
        });
      });
    }
    
    return columns;
  }
  
  private groupByRowFields() {
    const rowGroups: any = {};
    
    // Group data by row field values
    this.rawData.forEach(item => {
      const rowKey = this.getRowKey(item);
      
      if (!rowGroups[rowKey]) {
        rowGroups[rowKey] = {
          rowData: {},
          items: []
        };
        
        // Store row field values
        this.activeRows.forEach(rowField => {
          rowGroups[rowKey].rowData[rowField.field] = item[rowField.field as keyof SalesData];
        });
      }
      
      rowGroups[rowKey].items.push(item);
    });
    
    return rowGroups;
  }
  
  private getRowKey(item: SalesData) {
    return this.activeRows
      .map(f => item[f.field as keyof SalesData])
      .join('_');
  }
  
  private formatPivotData(rowGroups: any, uniqueColumnValues: any) {
    const result: any[] = [];
    
    // Process each row group
    Object.keys(rowGroups).forEach(rowKey => {
      const rowGroup = rowGroups[rowKey];
      const pivotRow: any = { ...rowGroup.rowData };
      
      // Initialize all column values to 0
      this.pivotColumns.forEach(column => {
        pivotRow[column.field] = 0;
      });
      
      // Aggregate values across column combinations
      rowGroup.items.forEach((item: SalesData) => {
        let columnKey = '';
        
        if (this.activeColumns.length === 1) {
          const field = this.activeColumns[0].field;
          columnKey = `${field}_${item[field as keyof SalesData]}`;
        } else if (this.activeColumns.length === 2) {
          const field1 = this.activeColumns[0].field;
          const field2 = this.activeColumns[1].field;
          columnKey = `${field1}_${item[field1 as keyof SalesData]}_${field2}_${item[field2 as keyof SalesData]}`;
        }
        
        // Aggregate value based on selected value field
        if (pivotRow[columnKey] !== undefined) {
          pivotRow[columnKey] += item[this.selectedValueField as keyof SalesData] as number;
        }
      });
      
      result.push(pivotRow);
    });
    
    return result;
  }
  
  toggleConfiguration() {
    this.isConfiguring.update(value => !value);
  }
  
  onDragStart(field: PivotField) {
    this.draggedField = field;
  }
  
  onDragEnd() {
    this.draggedField = null;
  }
  
  onDropToRows() {
    if (this.draggedField) {
      // Remove from current location
      this.removeFieldFromAllAreas(this.draggedField);
      
      // Add to rows
      this.pivotConfig.rows.push({
        ...this.draggedField,
        active: true
      });
      
      this.refreshPivotTable();
    }
  }
  
  onDropToColumns() {
    if (this.draggedField) {
      // Remove from current location
      this.removeFieldFromAllAreas(this.draggedField);
      
      // Add to columns
      this.pivotConfig.columns.push({
        ...this.draggedField,
        active: true
      });
      
      this.refreshPivotTable();
    }
  }
  
  onDropToValues() {
    if (this.draggedField) {
      // Remove from current location
      this.removeFieldFromAllAreas(this.draggedField);
      
      // Add to values
      this.pivotConfig.values.push({
        ...this.draggedField,
        active: true
      });
      
      this.refreshPivotTable();
    }
  }
  
  removeFieldFromAllAreas(field: PivotField) {
    this.pivotConfig.rows = this.pivotConfig.rows.filter(f => f.field !== field.field);
    this.pivotConfig.columns = this.pivotConfig.columns.filter(f => f.field !== field.field);
    this.pivotConfig.values = this.pivotConfig.values.filter(f => f.field !== field.field);
  }
  
  onValueFieldChange(field: string) {
    this.selectedValueField = field;
    this.refreshPivotTable();
  }
} 