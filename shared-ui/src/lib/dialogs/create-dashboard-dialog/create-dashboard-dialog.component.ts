import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import * as DashboardActions from 'dashboard-data-access';
import { NewDashboardPayload } from '@core/models/dashboard.state.model';

@Component({
  selector: 'app-create-dashboard-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './create-dashboard-dialog.component.html',
})
export class CreateDashboardDialogComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<CreateDashboardDialogComponent>);
  private existingIds: string[] = inject(MAT_DIALOG_DATA).existingIds;
  form = this.fb.group({
    id: [
      '',
      [
        Validators.required,
        Validators.maxLength(30),
        this.uniqueIdValidator.bind(this),
      ],
    ],
    title: ['', [Validators.required, Validators.maxLength(50)]],
    icon: ['', Validators.required],
  });
  private uniqueIdValidator(control: AbstractControl): ValidationErrors | null {
    if (this.existingIds.includes(control.value)) {
      return { notUnique: true };
    }
    return null;
  }
  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const formValue = this.form.getRawValue();
    const payload: NewDashboardPayload = {
      id: formValue.id!,
      title: formValue.title!,
      icon: formValue.icon!,
    };

    this.store.dispatch(DashboardActions.createDashboard({ payload }));
    this.dialogRef.close();
  }
}
