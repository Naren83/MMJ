import { Injectable, signal, computed } from '@angular/core';
import { CaseStatus, CasePriority } from '../models/mortgage-case.model';

export interface CaseFilters {
  searchTerm: string;
  status:     CaseStatus | 'All';
  priority:   CasePriority | 'All';
  channel:    string;
}

@Injectable({ providedIn: 'root' })
export class FilterService {
  readonly searchTerm = signal('');
  readonly status     = signal<CaseStatus | 'All'>('All');
  readonly priority   = signal<CasePriority | 'All'>('All');
  readonly channel    = signal('All');

  readonly activeFilterCount = computed(() => {
    let count = 0;
    if (this.searchTerm().trim())   count++;
    if (this.status()   !== 'All') count++;
    if (this.priority() !== 'All') count++;
    if (this.channel()  !== 'All') count++;
    return count;
  });

  readonly filters = computed<CaseFilters>(() => ({
    searchTerm: this.searchTerm(),
    status:     this.status(),
    priority:   this.priority(),
    channel:    this.channel(),
  }));

  reset(): void {
    this.searchTerm.set('');
    this.status.set('All');
    this.priority.set('All');
    this.channel.set('All');
  }
}
