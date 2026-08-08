import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MOCK_MORTGAGE_CASES } from '../../../../core/mocks/mock-cases';
import { CaseDetail } from './components/case-detail/case-detail';
import { CaseList } from './components/case-list/case-list';
import { CaseSidebar } from './components/case-sidebar/case-sidebar';
import { CaseSummaryMetrics } from './components/case-summary-metrics/case-summary-metrics';

@Component({
  selector: 'app-case-overview',
  imports: [CaseDetail, CaseList, CaseSidebar, CaseSummaryMetrics, FormsModule],
  templateUrl: './case-overview.html',
  styleUrl: './case-overview.scss'
})
export class CaseOverview {
  protected readonly searchTerm = signal('');
  protected readonly selectedCaseId = signal('CASE-1042');

  protected readonly cases = signal(MOCK_MORTGAGE_CASES);

  protected readonly filteredCases = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();

    if (!query) {
      return this.cases();
    }

    return this.cases().filter((caseItem) =>
      [
        caseItem.id,
        caseItem.borrower,
        caseItem.coBorrower ?? '',
        caseItem.status,
        caseItem.propertyAddress,
        caseItem.processor,
        caseItem.underwriter,
        caseItem.product
      ].some((value) => value.toLowerCase().includes(query))
    );
  });

  protected readonly selectedCase = computed(() => {
    return this.cases().find((caseItem) => caseItem.id === this.selectedCaseId()) ?? this.cases()[0];
  });

  protected readonly summary = computed(() => {
    const cases = this.cases();
    const totalLoanAmount = cases.reduce((sum, caseItem) => sum + caseItem.loanAmount, 0);
    const urgentCases = cases.filter((caseItem) => caseItem.priority === 'High').length;
    const openConditions = cases.reduce((sum, caseItem) => sum + caseItem.conditionsOpen, 0);
    const closingSoon = cases.filter((caseItem) => caseItem.slaHoursRemaining <= 12).length;

    return { totalLoanAmount, urgentCases, openConditions, closingSoon };
  });

  protected selectCase(caseId: string): void {
    this.selectedCaseId.set(caseId);
  }
}
