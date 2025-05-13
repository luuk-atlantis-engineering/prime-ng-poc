import { QuestionBase } from './question-base';

export class SelectQuestion extends QuestionBase<string> {
  override controlType = 'select';
  multiple: boolean;

  constructor(options: {
    value?: string;
    key?: string;
    label?: string;
    required?: boolean;
    order?: number;
    options?: {key: string; value: string}[];
    multiple?: boolean;
  } = {}) {
    super(options);
    this.multiple = options.multiple || false;
  }
} 