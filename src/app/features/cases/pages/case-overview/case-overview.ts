import { Component, computed, inject, signal } from '@angular/core';
import { CaseService } from '../../../../core/services/case.service';
import { FilterService } from '../../../../core/services/filter.service';
import { CaseDetail } from './components/case-detail/case-detail';
import { CaseList } from './components/case-list/case-list';
import { CaseSummaryMetrics } from './components/case-summary-metrics/case-summary-metrics';
import { CaseFilterToolbar } from '../../components/case-filter-toolbar/case-filter-toolbar';
import { CreateCaseModal } from '../../components/create-case-modal/create-case-modal';

@Component({
  selector: 'app-case-overview',
  standalone: true,
  imports: [CaseDetail, CaseList, CaseSummaryMetrics, CaseFilterToolbar, CreateCaseModal],
  templateUrl: './case-overview.html',
  styleUrl: './case-overview.scss'
})
export class CaseOverview {
  private readonly caseSvc   = inject(CaseService);
  protected readonly filterSvc = inject(FilterService);

  protected readonly selectedCaseId  = signal('CASE-1042');
  protected readonly createModalOpen = signal(false);

  protected readonly filteredCases = computed(() => {
    const f = this.filterSvc.filters();
    return this.caseSvc.filter(f.searchTerm, f.status, f.priority, f.channel);
  });

  protected readonly selectedCase = computed(() => {
    const cases = this.caseSvc.cases();
    return cases.find(c => c.id === this.selectedCaseId()) ?? cases[0];
  });

  protected readonly summary = this.caseSvc.summary;

  protected selectCase(caseId: string): void {
    this.selectedCaseId.set(caseId);
  }

  protected openCreateModal(): void {
    this.createModalOpen.set(true);
  }

  protected closeCreateModal(): void {
    this.createModalOpen.set(false);
  }
}
