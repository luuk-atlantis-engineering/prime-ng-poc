import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { LocalizationService } from '../../core/translations/localization.service';
import { LanguageEnum } from '../../shared/enums/language.enum';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MenubarModule,
    ButtonModule,
    DropdownModule,
    TranslatePipe
  ],
  providers: [
    TranslatePipe,
    LocalizationService
  ]
})
export class TopbarComponent {
  private translatePipe = inject(TranslatePipe);
  private localizationService = inject(LocalizationService);

  loggedInUsername: string | null = null;

  selectedLanguage = this.localizationService.getCurrentLanguage();

  languageOptions = [
    { code: LanguageEnum.enUS, label: 'English' },
    { code: LanguageEnum.elGR, label: 'Ελληνικά' }
  ];

  items = this.getMenuItems();

  switchLanguage(): void {
    const lang = this.selectedLanguage;

    if (lang) {
      this.localizationService.setLanguage(lang)
        .subscribe(() => {
          this.items = this.getMenuItems();
        });
    }
  }

  getMenuItems(): MenuItem[] {
    return [
      {
        label: this.translatePipe.transform('topbar.menuitem.warehouses'),
        icon: 'pi pi-warehouse',
        items: [
          {
            label: this.translatePipe.transform('topbar.menuitem.warehouse_list'),
            routerLink: ['/warehouse']
          }
        ]
      },
      {
        label: this.translatePipe.transform('topbar.menuitem.dynamic_form_test'),
        icon: 'pi pi-list',
        routerLink: ['/dynamic-form-test']
      },
      {
        label: this.translatePipe.transform('topbar.menuitem.data_table_test'),
        icon: 'pi pi-table',
        routerLink: ['/data-table-test']
      },
      {
        label: 'Just a Form',
        icon: 'pi pi-file-edit',
        routerLink: ['/just-a-form']
      },
      {
        label: 'Pivot Table',
        icon: 'pi pi-table',
        routerLink: ['/pivot-table']
      },
      {
        label: this.translatePipe.transform('topbar.menuitem.scheduler'),
        icon: 'pi pi-calendar',
        routerLink: ['/scheduler']
      },
      {
        label: `Legacy App`,
        items: [
          {
            label: `Home`,
            command: () => window.location.href = '/HomeNew/IndexNew'
          }
        ]
      },
    ];
  }
}
