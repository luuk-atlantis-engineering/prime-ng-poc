import { Component, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { TabViewModule } from 'primeng/tabview';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ScrollerModule } from 'primeng/scroller';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-warehouse',
  imports: [
    TranslatePipe,
    TreeModule,
    TreeTableModule,
    TabViewModule,
    CommonModule,
    DrawerModule,
    ToolbarModule,
    CardModule,
    AccordionModule,
    ButtonModule,
    ChartModule,
    ScrollerModule,
    MenuModule
  ],
  standalone: true,
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss'
})
export class WarehouseComponent implements OnInit {
  warehouses: TreeNode[] = [];
  cols: any[] = [];
  drawerVisible: boolean = false;
  selectedWarehouse: any = null;
  menuItems: MenuItem[] = [];
  
  // Chart data
  capacityChartData: any;
  inventoryChartData: any;
  chartOptions: any;
  
  // Activity log for virtual scroller
  recentActivities: any[] = [];

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    // Define columns for TreeTable
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'code', header: 'Code' },
      { field: 'type', header: 'Type' }
    ];

    // Sample hierarchical data
    this.warehouses = [
      {
        data: { name: 'USA', code: 'US', type: 'Country' },
        expanded: true,
        children: [
          {
            data: { name: 'California', code: 'CA', type: 'Region' },
            expanded: true,
            children: [
              { 
                data: { 
                  name: 'San Francisco Warehouse', 
                  code: 'SF-WH1', 
                  type: 'Warehouse',
                  address: '123 Market St, San Francisco, CA 94105',
                  contact: '+1 (415) 555-1234',
                  manager: 'John Smith',
                  capacity: 85000,
                  usedCapacity: 65000,
                  status: 'Active'
                } 
              },
              { 
                data: { 
                  name: 'Los Angeles Warehouse', 
                  code: 'LA-WH1', 
                  type: 'Warehouse',
                  address: '456 Ocean Ave, Los Angeles, CA 90001',
                  contact: '+1 (213) 555-5678',
                  manager: 'Maria Rodriguez',
                  capacity: 120000,
                  usedCapacity: 75000,
                  status: 'Active'
                } 
              }
            ]
          },
          {
            data: { name: 'New York', code: 'NY', type: 'Region' },
            children: [
              { 
                data: { 
                  name: 'New York City Warehouse', 
                  code: 'NYC-WH1', 
                  type: 'Warehouse',
                  address: '789 Broadway, New York, NY 10003',
                  contact: '+1 (212) 555-9012',
                  manager: 'David Johnson',
                  capacity: 95000,
                  usedCapacity: 92000,
                  status: 'Full'
                } 
              },
              { 
                data: { 
                  name: 'Buffalo Warehouse', 
                  code: 'BUF-WH1', 
                  type: 'Warehouse',
                  address: '101 Lake St, Buffalo, NY 14202',
                  contact: '+1 (716) 555-3456',
                  manager: 'Sarah Wilson',
                  capacity: 70000,
                  usedCapacity: 35000,
                  status: 'Active'
                } 
              }
            ]
          }
        ]
      },
      {
        data: { name: 'Germany', code: 'DE', type: 'Country' },
        children: [
          {
            data: { name: 'Bavaria', code: 'BY', type: 'Region' },
            children: [
              { 
                data: { 
                  name: 'Munich Warehouse', 
                  code: 'MUC-WH1', 
                  type: 'Warehouse',
                  address: 'Münchener Str. 123, 80331 Munich',
                  contact: '+49 89 12345678',
                  manager: 'Hans Weber',
                  capacity: 110000,
                  usedCapacity: 78000,
                  status: 'Active'
                } 
              }
            ]
          },
          {
            data: { name: 'Berlin', code: 'BE', type: 'Region' },
            children: [
              { 
                data: { 
                  name: 'Berlin Central Warehouse', 
                  code: 'BER-WH1', 
                  type: 'Warehouse',
                  address: 'Berliner Platz 45, 10115 Berlin',
                  contact: '+49 30 87654321',
                  manager: 'Claudia Müller',
                  capacity: 85000,
                  usedCapacity: 42000,
                  status: 'Maintenance'
                } 
              }
            ]
          }
        ]
      }
    ];
    
    // Initialize menu items with translations
    this.initMenuItems();
    
    // Initialize chart data and options
    this.initChartData();
    
    // Sample activity log data
    this.generateSampleActivityLog();
  }
  
  private initMenuItems() {
    this.menuItems = [
      { 
        label: this.translateService.instant('warehouse.actions.generate_report'), 
        icon: 'pi pi-file-pdf' 
      },
      { 
        label: this.translateService.instant('warehouse.actions.assign_manager'), 
        icon: 'pi pi-user-edit' 
      },
      { 
        label: this.translateService.instant('warehouse.actions.schedule_maintenance'), 
        icon: 'pi pi-calendar' 
      },
      { separator: true },
      { 
        label: this.translateService.instant('warehouse.actions.view_inventory'), 
        icon: 'pi pi-list' 
      }
    ];
  }
  
  selectNode(event: any) {
    // Only open drawer for warehouse type nodes
    if (event.node.data.type === 'Warehouse') {
      this.selectedWarehouse = event.node.data;
      this.drawerVisible = true;
      // Update chart data based on selected warehouse
      this.updateChartData();
    }
  }
  
  selectTableNode(event: any) {
    if (event.node.data.type === 'Warehouse') {
      this.selectedWarehouse = event.node.data;
      this.drawerVisible = true;
      // Update chart data based on selected warehouse
      this.updateChartData();
    }
  }
  
  closeDrawer() {
    // We control drawer closing explicitly
    this.drawerVisible = false;
  }
  
  onDrawerHide() {
    // This handles Escape key and any other close events
    this.drawerVisible = false;
  }
  
  private initChartData() {
    // Default chart options
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      }
    };
    
    // Default chart data (will be updated when warehouse is selected)
    this.capacityChartData = {
      labels: ['Used', 'Available'],
      datasets: [
        {
          data: [0, 0],
          backgroundColor: ['#FF6384', '#36A2EB']
        }
      ]
    };
    
    this.inventoryChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Inventory Levels',
          data: [0, 0, 0, 0, 0, 0],
          borderColor: '#FFA726',
          pointBackgroundColor: '#FFA726',
          fill: false,
          tension: 0.4
        }
      ]
    };
  }
  
  private updateChartData() {
    if (this.selectedWarehouse) {
      // Update capacity chart
      this.capacityChartData = {
        labels: ['Used', 'Available'],
        datasets: [
          {
            data: [
              this.selectedWarehouse.usedCapacity, 
              (this.selectedWarehouse.capacity - this.selectedWarehouse.usedCapacity)
            ],
            backgroundColor: ['#FF6384', '#36A2EB']
          }
        ]
      };
      
      // Update inventory chart with random data for demo
      const data = Array(6).fill(0).map(() => 
        Math.floor(Math.random() * (this.selectedWarehouse.usedCapacity * 0.2) + 
        (this.selectedWarehouse.usedCapacity * 0.8))
      );
      
      this.inventoryChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Inventory Levels',
            data: data,
            borderColor: '#FFA726',
            pointBackgroundColor: '#FFA726',
            fill: false,
            tension: 0.4
          }
        ]
      };
      
      // Filter activities for this warehouse
      this.recentActivities = this.recentActivities.filter(activity => 
        activity.warehouseCode === this.selectedWarehouse.code
      );
    }
  }
  
  private generateSampleActivityLog() {
    const activityTypes = ['Shipment Received', 'Shipment Sent', 'Inventory Count', 'Maintenance', 'Staff Change'];
    const warehouseCodes = ['SF-WH1', 'LA-WH1', 'NYC-WH1', 'BUF-WH1', 'MUC-WH1', 'BER-WH1'];
    
    // Generate 50 random activities across all warehouses
    this.recentActivities = Array(50).fill(0).map((_, i) => {
      const warehouseCode = warehouseCodes[Math.floor(Math.random() * warehouseCodes.length)];
      const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      return {
        id: i + 1,
        warehouseCode: warehouseCode,
        type: activityType,
        date: date,
        description: `${activityType} - ID: ${10000 + i}`,
        user: ['John D.', 'Maria R.', 'Alex S.', 'Sarah T.'][Math.floor(Math.random() * 4)]
      };
    });
    
    // Sort by date, newest first
    this.recentActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
