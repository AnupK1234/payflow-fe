import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize, catchError, of } from 'rxjs';

@Component({
  selector: 'app-raise-concern',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './raise-concern.html',
  styleUrls: ['./raise-concern.css'],
})
export class RaiseConcernComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  concernForm: FormGroup;
  file: File | null = null;
  submitting = signal(false);
  submissionResult = signal<'idle' | 'success' | 'error'>('idle');
  statusMsg = signal<string | null>(null);

  constructor() {
    this.concernForm = this.fb.group({
      description: ['', Validators.required],
    });
  }

  get description() { return this.concernForm.get('description')!; }
  get fileName() { return this.file?.name || null; }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }

  private getUserFromCookie(): any {
    const match = document.cookie.match(new RegExp('(^| )user=([^;]+)'));
    if (!match) return null;
    try {
      return JSON.parse(decodeURIComponent(match[2]));
    } catch (e) {
      console.error('Failed to parse cookie JSON', e);
      return null;
    }
  }

  submitConcern() {
    if (this.concernForm.invalid) {
      this.concernForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submissionResult.set('idle');
    this.statusMsg.set(null);

    const user = this.getUserFromCookie();
    if (!user?.employeeId) {
      this.submitting.set(false);
      this.submissionResult.set('error');
      this.statusMsg.set('Employee ID missing in cookies.');
      return;
    }

   
    this.http.get<number>(`http://localhost:8080/api/concerns/employee/${user.employeeId}/organization`)
      .pipe(
        catchError(err => {
          this.submitting.set(false);
          this.submissionResult.set('error');
          this.statusMsg.set(err.error?.message || 'Failed to fetch organization ID.');
          return of(null);
        })
      )
      .subscribe(orgId => {
        if (!orgId) return;

        const payload = {
          employeeId: user.employeeId,
          organizationId: orgId,
          description: this.description.value
        };

       
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
        if (this.file) {
          formData.append('attachment', this.file, this.file.name);
        }

        this.http.post('http://localhost:8080/api/concerns/raise', formData)
          .pipe(finalize(() => this.submitting.set(false)))
          .subscribe({
            next: () => {
              this.submissionResult.set('success');
              this.statusMsg.set('Concern submitted successfully!');
              this.concernForm.reset();
              this.file = null;
            },
            error: (err) => {
              this.submissionResult.set('error');
              this.statusMsg.set(err.error?.message || 'Submission failed.');
            }
          });
      });
  }

  isSubmitting() { return this.submitting(); }
  submissionStatus() { return this.submissionResult(); }
  statusMessage() { return this.statusMsg(); }
}
