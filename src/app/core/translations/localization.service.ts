import { inject, Injectable } from '@angular/core';
import { InterpolatableTranslation, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LanguageEnum, supportedLanguages } from '../../shared/enums/language.enum';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private translate = inject(TranslateService);

  private readonly defaultLangKey = 'aimms:language-key';
  private defaultLanguage = LanguageEnum.enUS;
  private supportedLanguages = supportedLanguages();

  initializeLanguage(): Observable<InterpolatableTranslation> {
    let language = localStorage.getItem(this.defaultLangKey) as LanguageEnum;

    if (!language || !this.supportedLanguages.includes(language)) {
      language = this.defaultLanguage;
    }

    this.translate.setDefaultLang(language);
    return this.setLanguage(language);
  }

  setLanguage(language: LanguageEnum): Observable<InterpolatableTranslation> {
    if (!this.supportedLanguages.includes(language)) {
      language = this.defaultLanguage;
    }

    localStorage.setItem(this.defaultLangKey, language);
    return this.translate.use(language);
  }

  getCurrentLanguage(): LanguageEnum {
    return (this.translate.currentLang || this.defaultLanguage) as LanguageEnum;
  }
}
