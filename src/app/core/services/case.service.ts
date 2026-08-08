import { Injectable, signal, computed } from '@angular/core';
import { MOCK_MORTGAGE_CASES } from '../mocks/mock-cases';
import { MortgageCase, CaseStatus, CasePriority } from '../models/mortgage-case.model';

export interface PipelineStage {
  status: CaseStatus;
  label: string;
  cases: MortgageCase[];
}

@Injectable({ providedIn: 'root' })
export class CaseService {
  private readonly _cases = signal<MortgageCase[]>(MOCK_MORTGAGE_CASES);

  readonly cases = this._cases.asReadonly();

  /** Summary KPIs for the overview metrics strip */
  readonly summary = computed(() => {
    const cases = this._cases();
    return {
      totalLoanAmount: cases.reduce((sum, c) => sum + c.loanAmount, 0),
      urgentCases:     cases.filter(c => c.priority === 'High').length,
      openConditions:  cases.reduce((sum, c) => sum + c.conditionsOpen, 0),
      closingSoon:     cases.filter(c => c.slaHoursRemaining <= 12).length,
    };
  });

  /** Grouped by status for the Pipeline Kanban board */
  readonly pipelineStages = computed((): PipelineStage[] => {
    const cases = this._cases();
    const ORDER: CaseStatus[] = ['New', 'In Review', 'Conditional Approval', 'Clear to Close'];
    return ORDER.map(status => ({
      status,
      label: status,
      cases: cases.filter(c => c.status === status)
    }));
  });

  /** Cases closing within 48 hours — for Closing Desk */
  readonly closingSoon = computed(() =>
    this._cases().filter(c => c.slaHoursRemaining <= 48)
      .sort((a, b) => a.slaHoursRemaining - b.slaHoursRemaining)
  );

  // ── Queries ────────────────────────────────────────────────

  getById(id: string): MortgageCase | undefined {
    return this._cases().find(c => c.id === id);
  }

  filter(
    query    : string,
    status   : CaseStatus | 'All',
    priority : CasePriority | 'All',
    channel  : string
  ): MortgageCase[] {
    return this._cases().filter(c => {
      const q = query.toLowerCase().trim();
      const matchesQuery    = !q || [c.id, c.borrower, c.coBorrower ?? '', c.status, c.propertyAddress, c.processor, c.underwriter, c.product].some(v => v.toLowerCase().includes(q));
      const matchesStatus   = status   === 'All' || c.status   === status;
      const matchesPriority = priority === 'All' || c.priority === priority;
      const matchesChannel  = channel  === 'All' || c.channel  === channel;
      return matchesQuery && matchesStatus && matchesPriority && matchesChannel;
    });
  }

  // ── Mutations ──────────────────────────────────────────────

  updateStatus(caseId: string, status: CaseStatus): void {
    this._cases.update(cases =>
      cases.map(c => c.id === caseId ? { ...c, status, lastUpdated: new Date().toISOString() } : c)
    );
  }

  addCase(newCase: MortgageCase): void {
    this._cases.update(cases => [newCase, ...cases]);
  }

  updateCase(caseId: string, patch: Partial<MortgageCase>): void {
    this._cases.update(cases =>
      cases.map(c => c.id === caseId ? { ...c, ...patch, lastUpdated: new Date().toISOString() } : c)
    );
  }

  // ── Helpers ────────────────────────────────────────────────

  get channels(): string[] {
    return [...new Set(this._cases().map(c => c.channel))].sort();
  }
}
