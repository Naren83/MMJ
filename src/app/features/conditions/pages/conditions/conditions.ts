import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConditionService } from '../../../../core/services/condition.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConditionItem, ConditionStatus, ConditionCategory } from '../../../../core/models/condition.model';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select';

const STATUSES: (ConditionStatus | 'All')[] = ['All', 'Open', 'Received', 'Cleared', 'Waived'];
const CATEGORIES: (ConditionCategory | 'All')[] = ['All', 'Income', 'Asset', 'Credit', 'Property', 'Title', 'Insurance', 'Compliance'];

@Component({
  selector: 'app-conditions',
  standalone: true,
  imports: [FormsModule, DatePipe, RouterLink, CustomSelectComponent],
  templateUrl: './conditions.html',
  styleUrl: './conditions.scss'
})
export class Conditions {
  protected readonly condSvc   = inject(ConditionService);
  private readonly notifySvc   = inject(NotificationService);

  protected readonly statuses   = STATUSES;
  protected readonly categories = CATEGORIES;

  protected readonly search   = signal('');
  protected readonly status   = signal<ConditionStatus | 'All'>('All');
  protected readonly category = signal<ConditionCategory | 'All'>('All');

  protected readonly summary = this.condSvc.summary;

  protected readonly filtered = computed(() =>
    this.condSvc.filter(this.search(), this.status(), this.category())
  );

  protected setCategory(val: string): void {
    this.category.set(val as ConditionCategory | 'All');
  }

  protected updateStatus(cond: ConditionItem, status: ConditionStatus): void {
    this.condSvc.updateStatus(cond.id, status);
    if (status === 'Cleared') {
      this.notifySvc.showSuccess('Condition Cleared', `${cond.id} (${cond.category}) has been cleared.`);
    } else if (status === 'Received') {
      this.notifySvc.showInfo('Documentation Received', `${cond.id} marked as Received for ${cond.borrower}.`);
    }
  }

  protected trackCond(i: number, c: ConditionItem): string { return c.id; }
}
