import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-new-tab-title-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>Add New Tab</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="fill">
          <mat-label>Tab Title</mat-label>
          <input matInput formControlName="title" cdkFocusInitial />
          <mat-error *ngIf="form.controls.title.hasError('required')">
            Title is required
          </mat-error>
          <mat-error *ngIf="form.controls.title.hasError('maxlength')">
            Title cannot exceed 50 characters
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="form.invalid"
      >
        Add
      </button>
    </mat-dialog-actions>
  `,
})
export class NewTabTitleDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<NewTabTitleDialogComponent>);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.title);
    }
  }
}
