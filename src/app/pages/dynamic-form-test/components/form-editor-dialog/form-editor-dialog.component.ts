import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormGroup as AngularFormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { QuestionBase } from '../../models/question-base';
import { TextboxQuestion } from '../../models/question-textbox';
import { DropdownQuestion } from '../../models/question-dropdown';
import { SelectQuestion } from '../../models/question-select';
import { CheckboxQuestion } from '../../models/question-checkbox';

@Component({
  selector: 'app-form-editor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    DialogModule,
    TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-editor-dialog.component.html'
})
export class FormEditorDialogComponent {
  editingQuestion = input<QuestionBase<string | boolean> | null>(null);
  visible = input<boolean>(false);
  save = output<QuestionBase<string | boolean>>();
  cancel = output<void>();

  private translateService = inject(TranslateService);
  private fb = inject(FormBuilder);

  fieldForm: FormGroup;
  fieldTypes = [
    { label: this.translateService.instant('DYNAMIC_FORM_TEST.EDITOR.FIELD_TYPES.TEXTBOX'), value: 'textbox' },
    { label: this.translateService.instant('DYNAMIC_FORM_TEST.EDITOR.FIELD_TYPES.DROPDOWN'), value: 'dropdown' },
    { label: this.translateService.instant('DYNAMIC_FORM_TEST.EDITOR.FIELD_TYPES.SELECT'), value: 'select' },
    { label: this.translateService.instant('DYNAMIC_FORM_TEST.EDITOR.FIELD_TYPES.CHECKBOX'), value: 'checkbox' }
  ];

  constructor() {
    this.fieldForm = this.fb.group({
      controlType: ['', Validators.required],
      key: ['', Validators.required],
      label: ['', Validators.required],
      required: [false],
      multiple: [false],
      options: this.fb.array([])
    });
    
    // Initialize with initial value if available
    const question = this.editingQuestion();
    if (question) {
      this.initializeForm(question);
    }
    
    // Set up a computed to watch for changes to the editingQuestion input
    computed(() => {
      const question = this.editingQuestion();
      if (question) {
        this.initializeForm(question);
      }
    });
  }

  private initializeForm(question: QuestionBase<string | boolean>): void {
    const optionsArray = this.fb.array(
      (question.options || []).map(option => 
        this.fb.group({
          key: [option.key],
          value: [option.value]
        })
      )
    );

    this.fieldForm.patchValue({
      controlType: question.controlType,
      key: question.key,
      label: question.label,
      required: question.required,
      multiple: (question as SelectQuestion).multiple
    });

    this.fieldForm.setControl('options', optionsArray);
  }

  get optionsArray() {
    return this.fieldForm.get('options') as FormArray;
  }

  getOptionFormGroup(index: number): AngularFormGroup {
    return this.optionsArray.at(index) as AngularFormGroup;
  }

  addOption() {
    const optionGroup = this.fb.group({
      key: [''],
      value: ['']
    });
    this.optionsArray.push(optionGroup);
  }

  removeOption(index: number) {
    this.optionsArray.removeAt(index);
  }

  saveField() {
    if (this.fieldForm.valid) {
      const formValue = this.fieldForm.value;
      let question: QuestionBase<string | boolean>;

      switch (formValue.controlType) {
        case 'textbox':
          question = new TextboxQuestion({
            key: formValue.key,
            label: formValue.label,
            required: formValue.required
          });
          break;
        case 'dropdown':
          question = new DropdownQuestion({
            key: formValue.key,
            label: formValue.label,
            required: formValue.required,
            options: this.optionsArray.value
          });
          break;
        case 'select':
          question = new SelectQuestion({
            key: formValue.key,
            label: formValue.label,
            required: formValue.required,
            options: this.optionsArray.value,
            multiple: formValue.multiple
          });
          break;
        case 'checkbox':
          question = new CheckboxQuestion({
            key: formValue.key,
            label: formValue.label,
            required: formValue.required
          });
          break;
        default:
          return;
      }

      this.save.emit(question);
    }
  }

  cancelEdit() {
    this.cancel.emit();
  }
} 