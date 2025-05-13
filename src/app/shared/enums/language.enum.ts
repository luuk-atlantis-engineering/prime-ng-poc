export enum LanguageEnum {
  enUS = 'en-US',
  elGR = 'el-GR'
}

export function supportedLanguages(): LanguageEnum[] {
  return [
    LanguageEnum.enUS,
    LanguageEnum.elGR
  ];
}
