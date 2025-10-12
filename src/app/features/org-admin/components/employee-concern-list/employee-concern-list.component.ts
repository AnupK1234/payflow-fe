import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Concern, ConcernStatus } from '../../models/concern.interface';

@Component({
  selector: 'app-concerns-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee-concern-list.component.html',
  styleUrl: './employee-concern-list.component.scss',
})
export class ConcernsListComponent {
  private service = inject(EmployeeService);
  private fb = inject(FormBuilder);

  concerns = signal<Concern[]>([]);
  loading = signal(false);
  error = signal('');
  statuses: ConcernStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

  ngOnInit() {
    this.loadConcerns();
  }

  loadConcerns() {
    this.loading.set(true);
    this.service.getConcernList().subscribe({
      next: (data: Concern[]) => {
        // Force-cast if backend returns lowercase or string statuses
        const normalized = data.map((d) => ({
          ...d,
          status: d.status.toUpperCase().replace(' ', '_') as ConcernStatus,
        }));
        this.concerns.set(normalized);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to load concerns');
        this.loading.set(false);
      },
    });
  }

  updateStatus(concern: Concern, newStatus: ConcernStatus) {
    console.log("New status : " + newStatus + " concern status " +    concern.status);
    
    if (!newStatus || newStatus === concern.status) return;

    const reqBody = { status: newStatus };

    this.service.updateConcernStatus(concern.id, reqBody).subscribe({
      next: () => {
        this.concerns.update((list) =>
          list.map((c) =>
            c.id === concern.id ? { ...c, status: newStatus } : c
          )
        );
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update status.');
      },
    });
  }

  onStatusChange(concern: Concern, event: Event) {
  const select = event.target as HTMLSelectElement | null;
  if (!select) return;
  const newStatus = select.value as Concern['status'];
  this.updateStatus(concern, newStatus);
}

}
