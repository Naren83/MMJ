import { Component, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CaseService } from '../../../../core/services/case.service';
import { FilterService } from '../../../../core/services/filter.service';
import { CaseStatus, CasePriority } from '../../../../core/models/mortgage-case.model';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select';

const STATUSES: (CaseStatus | 'All')[] = ['All', 'New', 'In Review', 'Conditional Approval', 'Clear to Close'];
const PRIORITIES: (CasePriority | 'All')[] = ['All', 'High', 'Medium', 'Low'];

@Component({
  selector: 'app-case-filter-toolbar',
  standalone: true,
  imports: [FormsModule, CustomSelectComponent],
  templateUrl: './case-filter-toolbar.html',
  styleUrl: './case-filter-toolbar.scss'
})
export class CaseFilterToolbar {
  protected readonly filterSvc = inject(FilterService);
  private readonly caseSvc     = inject(CaseService);

  protected readonly statuses   = STATUSES;
  protected readonly priorities = PRIORITIES;

  protected readonly channels = computed(() => ['All', ...this.caseSvc.channels]);

  protected setSearch(value: string): void {
    this.filterSvc.searchTerm.set(value);
  }

  protected setStatus(s: CaseStatus | 'All'): void {
    this.filterSvc.status.set(s);
  }

  protected setPriority(p: CasePriority | 'All'): void {
    this.filterSvc.priority.set(p);
  }

  protected setChannel(c: string): void {
    this.filterSvc.channel.set(c);
  }

  protected clearAll(): void {
    this.filterSvc.reset();
  }
}
