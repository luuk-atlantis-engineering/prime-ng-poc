import { Injectable, computed, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '../models/question-base';

@Injectable()
export class QuestionControlService {
  private questionsSignal = signal<QuestionBase<string | boolean>[]>([]);
  private formGroupSignal = signal<FormGroup>(new FormGroup({}));

  questions = this.questionsSignal.asReadonly();
  formGroup = this.formGroupSignal.asReadonly();

  toFormGroup(questions: QuestionBase<string | boolean>[]) {
    const group: Record<string, FormControl> = {};
    questions.forEach(question => {
      const defaultValue = question.value !== undefined ? question.value : '';
      group[question.key] = question.required
        ? new FormControl(defaultValue, Validators.required)
        : new FormControl(defaultValue);
    });
    return new FormGroup(group);
  }

  setQuestions(questions: QuestionBase<string | boolean>[]) {
    this.questionsSignal.set(questions);
    this.formGroupSignal.set(this.toFormGroup(questions));
  }

  updateFormValue(key: string, value: any) {
    const currentForm = this.formGroupSignal();
    if (currentForm.contains(key)) {
      currentForm.get(key)?.setValue(value);
      this.formGroupSignal.set(currentForm);
    }
  }

  resetForm() {
    const currentForm = this.formGroupSignal();
    currentForm.reset();
    this.formGroupSignal.set(currentForm);
  }
} 