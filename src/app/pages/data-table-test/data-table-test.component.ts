import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DragDropModule } from 'primeng/dragdrop';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { OrderListModule } from 'primeng/orderlist';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { FilterService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  rating: number;
  expirationDate: Date;
}

interface Column {
  field: string;
  header: string;
  visible: boolean;
}

type ColumnManagementMode = 'checkbox' | 'dragdrop';

@Component({
  selector: 'app-data-table-test',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    CardModule,
    TableModule,
    DragDropModule,
    CheckboxModule,
    FormsModule,
    TooltipModule,
    OrderListModule,
    SelectButtonModule,
    AutoCompleteModule,
    CalendarModule,
    DropdownModule,
    InputTextModule
  ],
  providers: [FilterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-table-test.component.html',
  styleUrls: ['./data-table-test.component.scss']
})
export class DataTableTestComponent {
  isEditMode = signal(false);
  isDragging = signal(false);
  draggedColumn = signal<Column | null>(null);
  isFromTable = signal(false);
  columnManagementMode = signal<ColumnManagementMode>('checkbox');
  
  columnManagementModeOptions = [
    { label: 'Checkbox', value: 'checkbox' },
    { label: 'Drag & Drop', value: 'dragdrop' }
  ];
  
  products: Product[] = [];
  filteredTableProducts: Product[] = [];
  
  availableColumns: Column[] = [
    { field: 'id', header: 'ID', visible: true },
    { field: 'code', header: 'Code', visible: true },
    { field: 'name', header: 'Name', visible: true },
    { field: 'category', header: 'Category', visible: true },
    { field: 'quantity', header: 'Quantity', visible: true },
    { field: 'price', header: 'Price', visible: false },
    { field: 'rating', header: 'Rating', visible: false },
    { field: 'expirationDate', header: 'Expiration Date', visible: true }
  ];
  
  visibleColumns = signal<Column[]>([]);
  hiddenColumns = signal<Column[]>([]);
  visibleColumnsArray: Column[] = [];
  
  // Add autocomplete properties
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;
  
  // Add filter properties
  filters: { [key: string]: any } = {};
  dateFilterValue: Date | null = null;
  filterMatchMode = {
    'name': 'contains',
    'category': 'contains',
    'code': 'contains',
    'quantity': 'equals',
    'price': 'equals',
    'rating': 'equals',
    'expirationDate': 'dateIs'
  };
  
  constructor(private filterService: FilterService) {
    this.generateDummyData();
    this.updateColumnLists();
    this.filteredTableProducts = [...this.products];
  }
  
  toggleEditMode() {
    this.isEditMode.update(value => !value);
  }
  
  generateDummyData() {
    const categories = ['Electronics', 'Clothing', 'Food', 'Tools', 'Books'];
    
    for (let i = 1; i <= 20; i++) {
      // Generate a random date between now and 2 years from now
      const randomDays = Math.floor(Math.random() * 730); // 730 days = 2 years
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + randomDays);
      
      this.products.push({
        id: `${i}`,
        code: `PROD-${1000 + i}`,
        name: `Product ${i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        quantity: Math.floor(Math.random() * 100),
        price: parseFloat((Math.random() * 1000).toFixed(2)),
        rating: Math.floor(Math.random() * 5) + 1,
        expirationDate: expirationDate
      });
    }
  }
  
  updateColumnLists() {
    const visibleCols = this.availableColumns.filter(col => col.visible);
    const hiddenCols = this.availableColumns.filter(col => !col.visible);
    
    this.visibleColumns.set(visibleCols);
    this.hiddenColumns.set(hiddenCols);
    this.visibleColumnsArray = [...visibleCols];
  }
  
  onColumnsReordered() {
    this.visibleColumns.set([...this.visibleColumnsArray]);
  }
  
  onColumnDragStart(column: Column, fromTable = false) {
    this.isDragging.set(true);
    this.draggedColumn.set(column);
    this.isFromTable.set(fromTable);
  }
  
  onColumnDragEnd() {
    this.isDragging.set(false);
    this.draggedColumn.set(null);
    this.isFromTable.set(false);
  }
  
  isTableColumnDragging() {
    return this.isFromTable();
  }
  
  onColumnDrop(dropIndex: number) {
    if (!this.draggedColumn()) return;
    
    const draggedColumn = this.draggedColumn();
    
    // If the column is from the hidden columns, add it to the visible columns
    if (!this.isFromTable()) {
      // Find the column in availableColumns and make it visible
      const index = this.availableColumns.findIndex(col => col.field === draggedColumn?.field);
      if (index !== -1) {
        this.availableColumns[index].visible = true;
        
        // Create a new array with the column inserted at the drop index
        const newVisibleColumns = [...this.visibleColumnsArray];
        newVisibleColumns.splice(dropIndex, 0, this.availableColumns[index]);
        
        // Update the visible columns array and signal
        this.visibleColumnsArray = newVisibleColumns;
        this.visibleColumns.set(newVisibleColumns);
        
        // Update the hidden columns
        this.hiddenColumns.set(this.availableColumns.filter(col => !col.visible));
      }
    } else {
      // If the column is from the table, reorder it
      const dragIndex = this.visibleColumnsArray.findIndex(col => col.field === draggedColumn?.field);
      
      if (dragIndex !== -1 && dragIndex !== dropIndex) {
        // Remove the column from its current position
        const columnToMove = this.visibleColumnsArray.splice(dragIndex, 1)[0];
        
        // Insert the column at the new position
        this.visibleColumnsArray.splice(dropIndex, 0, columnToMove);
        
        // Update the signal
        this.visibleColumns.set([...this.visibleColumnsArray]);
      }
    }
    
    this.onColumnDragEnd();
  }
  
  onAddColumnToTable(column: Column) {
    // Update column visibility
    const index = this.availableColumns.findIndex(col => col.field === column.field);
    if (index !== -1) {
      this.availableColumns[index].visible = true;
      this.updateColumnLists();
    }
    
    this.onColumnDragEnd();
  }
  
  onRemoveColumnFromTable(column: Column) {
    // Only allow removing columns that are from the table
    if (!this.isFromTable()) return;
    
    // Update column visibility
    const index = this.availableColumns.findIndex(col => col.field === column.field);
    if (index !== -1) {
      this.availableColumns[index].visible = false;
      this.updateColumnLists();
    }
    
    this.onColumnDragEnd();
  }
  
  onColumnManagementModeChange(mode: ColumnManagementMode) {
    this.columnManagementMode.set(mode);
  }
  
  filterProducts(event: { query: string }) {
    const query = event.query.toLowerCase();
    
    // If query is empty, reset to show all products
    if (!query.trim()) {
      this.filteredProducts = [];
      this.filteredTableProducts = [...this.products];
      return;
    }
    
    // Get distinct categories that match the query
    const distinctCategories = [...new Set(
      this.products
        .filter(product => product.category.toLowerCase().includes(query))
        .map(product => product.category)
    )].map(category => ({
      id: category,
      code: category,
      name: category,
      category: category,
      quantity: 0,
      price: 0,
      rating: 0,
      expirationDate: new Date()
    }));
    
    this.filteredProducts = distinctCategories;
    
    // Update the table data
    this.filteredTableProducts = this.products.filter(product => 
      product.category.toLowerCase().includes(query)
    );
  }

  // Add method to handle selection
  onProductSelect(event: any) {
    this.selectedProduct = event;
    if (event) {
      this.filteredTableProducts = this.products.filter(p => 
        p.category.toLowerCase() === event.category.toLowerCase()
      );
    } else {
      this.filteredTableProducts = [...this.products];
    }
  }

  // Add method to handle clearing the input
  onClear() {
    this.selectedProduct = null;
    this.filteredTableProducts = [...this.products];
  }

  // Add filter change handler
  onFilterChange(event: Event, field: string) {
    const value = (event.target as HTMLInputElement).value;
    this.filters[field].value = value;
    this.applyFilters();
  }

  // Add date filter handler
  onDateFilterChange(date: Date | null, field: string) {
    this.filters[field].value = date;
    this.applyFilters();
  }

  // Apply filters to the table
  private applyFilters() {
    this.filteredTableProducts = this.products.filter(product => {
      return Object.entries(this.filters).every(([field, filter]) => {
        if (!filter.value) return true;
        
        const value = product[field as keyof Product];
        switch (filter.matchMode) {
          case 'contains':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'equals':
            return value === filter.value;
          case 'dateIs':
            if (!(value instanceof Date) || !(filter.value instanceof Date)) return true;
            return value.toDateString() === filter.value.toDateString();
          default:
            return true;
        }
      });
    });
  }
} 

