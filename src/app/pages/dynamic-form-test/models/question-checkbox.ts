import { QuestionBase } from './question-base';

export class CheckboxQuestion extends QuestionBase<boolean> {
  override controlType = 'checkbox';

  constructor(options: {
    value?: boolean;
    key?: string;
    label?: string;
    required?: boolean;
    order?: number;
  } = {}) {
    super(options);
    this.value = options.value || false;
  }
} 