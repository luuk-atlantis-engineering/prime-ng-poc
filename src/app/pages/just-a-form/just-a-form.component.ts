import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ColorPickerModule } from 'primeng/colorpicker';
import { EditorModule } from 'primeng/editor';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-just-a-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    ColorPickerModule,
    EditorModule,
    InputNumberModule,
    PasswordModule,
    RadioButtonModule,
    TextareaModule,
    FileUploadModule,
    TooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './just-a-form.component.html'
})
export class JustAFormComponent {
  private fb = inject(FormBuilder);
  
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    country: ['', [Validators.required]],
    favoriteColor: ['#3366ff'],
    biography: [''],
    age: [25],
    password: ['', [Validators.required, Validators.minLength(8)]],
    gender: ['male'],
    comments: [''],
    agreeToTerms: [false, [Validators.requiredTrue]]
  });

  countries = [
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'Canada', code: 'CA' },
    { name: 'Australia', code: 'AU' },
    { name: 'Germany', code: 'DE' },
    { name: 'France', code: 'FR' },
    { name: 'Japan', code: 'JP' }
  ];

  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ];

  uploadedFiles: any[] = [];

  payLoad = signal('');

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = {...this.form.value};
      
      // Add file names if files were uploaded
      if (this.uploadedFiles.length > 0) {
        formData.files = this.uploadedFiles.map(file => file.name);
      }
      
      this.payLoad.set(JSON.stringify(formData, null, 2));
    }
  }

  resetForm() {
    this.form.reset({
      favoriteColor: '#3366ff',
      age: 25,
      gender: 'male'
    });
    this.uploadedFiles = [];
    this.payLoad.set('');
  }
} 