import { ChangeDetectionStrategy, Component, Input, computed } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuestionBase } from '../../models/question-base';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { SelectQuestion } from '../../models/question-select';
import { CheckboxQuestion } from '../../models/question-checkbox';

@Component({
  selector: 'app-dynamic-form-question',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent {
  @Input({ required: true }) question!: QuestionBase<string | boolean>;
  @Input({ required: true }) form!: FormGroup;

  isValid = computed(() => this.form.controls[this.question.key].valid);

  isSelectQuestion(question: QuestionBase<string | boolean>): question is SelectQuestion {
    return question.controlType === 'select';
  }
} 