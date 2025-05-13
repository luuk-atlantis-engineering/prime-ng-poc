import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { QuestionBase } from './models/question-base';
import { TextboxQuestion } from './models/question-textbox';
import { DropdownQuestion } from './models/question-dropdown';
import { SelectQuestion } from './models/question-select';
import { CheckboxQuestion } from './models/question-checkbox';
import { QuestionControlService } from './services/question-control.service';
import { DynamicFormQuestionComponent } from './components/dynamic-form-question/dynamic-form-question.component';
import { FormEditorComponent } from './components/form-editor/form-editor.component';

@Component({
  selector: 'app-dynamic-form-test',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DynamicFormQuestionComponent,
    FormEditorComponent
  ],
  providers: [QuestionControlService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dynamic-form-test.component.html'
})
export class DynamicFormTestComponent {
  private questionControlService = inject(QuestionControlService);
  
  form = this.questionControlService.formGroup;
  questions = this.questionControlService.questions;
  payLoad = signal('');
  isEditMode = signal(false);

  constructor() {
    this.initializeQuestions();
  }

  private initializeQuestions() {
    const questions: QuestionBase<string | boolean>[] = [
      new DropdownQuestion({
        key: 'rating',
        label: 'Rating',
        options: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unproven', value: 'Unproven' }
        ],
      }),

      new TextboxQuestion({
        key: 'firstName',
        label: 'First name',
        value: 'Default value',
        required: true,
      }),

      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
      }),

      new SelectQuestion({
        key: 'skills',
        label: 'Skills',
        options: [
          { key: 'angular', value: 'Angular' },
          { key: 'typescript', value: 'TypeScript' },
          { key: 'javascript', value: 'JavaScript' },
          { key: 'html', value: 'HTML' },
          { key: 'css', value: 'CSS' }
        ],
        multiple: true,
        required: true
      }),

      new CheckboxQuestion({
        key: 'newsletter',
        label: 'Subscribe to newsletter',
        value: false,
        required: true
      })
    ];

    this.questionControlService.setQuestions(questions);
  }

  toggleEditMode() {
    this.isEditMode.update(mode => !mode);
  }

  onQuestionsChange(questions: QuestionBase<string | boolean>[]) {
    this.questionControlService.setQuestions(questions);
  }

  onSubmit() {
    this.payLoad.set(JSON.stringify(this.form().getRawValue()));
  }

  resetForm() {
    this.form().reset();
    this.payLoad.set('');
  }
} 