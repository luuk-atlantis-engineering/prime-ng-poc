import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './routes/app.routes';

import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { redirectInterceptor } from './core/interceptors/redirect.interceptor';
import { LocalizationService } from './core/translations/localization.service';

import { MissingTranslationHandler, provideTranslateService, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppMissingTranslationHandler } from './core/translations/app-missing-translation.handler';

const httpTranslateLoaderFactory: (http: HttpClient) =>
  TranslateHttpLoader = (http: HttpClient) =>
    new TranslateHttpLoader(http, './assets/i18n/', '.json');

const appInitializerFactory = () => {
  const localizationService = inject(LocalizationService);
  return localizationService.initializeLanguage();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([redirectInterceptor])
    ),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    provideAppInitializer(
      appInitializerFactory
    ),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: AppMissingTranslationHandler
      }
    })
  ]
};
