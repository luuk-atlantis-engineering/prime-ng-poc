import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { QuestionBase } from '../../models/question-base';
import { FormEditorDialogComponent } from '../form-editor-dialog/form-editor-dialog.component';

@Component({
  selector: 'app-form-editor',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TranslateModule,
    FormEditorDialogComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-editor.component.html'
})
export class FormEditorComponent {

  // Inputs
  questions = input<QuestionBase<string | boolean>[]>([]);
  questionsChange = output<QuestionBase<string | boolean>[]>();

  // Signals
  showDialog = signal(false);
  editingQuestion = signal<QuestionBase<string | boolean> | null>(null);

  showAddFieldDialog() {
    this.editingQuestion.set(null);
    this.showDialog.set(true);
  }

  editField(question: QuestionBase<string | boolean>) {
    this.editingQuestion.set(question);
    this.showDialog.set(true);
  }

  removeField(question: QuestionBase<string | boolean>) {
    const updatedQuestions = this.questions().filter(q => q.key !== question.key);
    this.questionsChange.emit(updatedQuestions);
  }

  onSave(question: QuestionBase<string | boolean>) {

    let updatedQuestions: QuestionBase<string | boolean>[];
    if (this.editingQuestion()) {
      updatedQuestions = this.questions().map(q =>
        q.key === this.editingQuestion()?.key ? question : q
      );
    } else {
      updatedQuestions = [...this.questions(), question];
    }

    this.questionsChange.emit(updatedQuestions);
    this.showDialog.set(false);
  }

  onCancel() {
    this.showDialog.set(false);
    this.editingQuestion.set(null);
  }
} 