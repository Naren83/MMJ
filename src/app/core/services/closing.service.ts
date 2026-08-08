import { Injectable, signal, computed } from '@angular/core';
import { MOCK_MORTGAGE_CASES } from '../mocks/mock-cases';
import { ClosingItem, ClosingStatus } from '../models/closing.model';

const MOCK_CLOSINGS: ClosingItem[] = [
  {
    id: 'CLOSE-001', caseId: 'CASE-1054', borrower: 'Sophia Kim',
    loanAmount: 689000, closingDate: '2026-08-14', closingAgent: 'Sandra Liu',
    titleCompany: 'First American Title', status: 'Docs Out',
    cdSent: true, wireConfirmed: true, docsReturned: false,
    fundingAmount: 689000, notes: 'Jumbo — wire must arrive by 2pm ET'
  },
  {
    id: 'CLOSE-002', caseId: 'CASE-1042', borrower: 'Emma Rodriguez',
    loanAmount: 468000, closingDate: '2026-08-21', closingAgent: 'James Porter',
    titleCompany: 'Stewart Title', status: 'Scheduled',
    cdSent: true, wireConfirmed: false, docsReturned: false,
    fundingAmount: 468000, notes: 'Review updated bank statements before closing'
  },
  {
    id: 'CLOSE-003', caseId: 'CASE-1038', borrower: 'Noah Williams',
    loanAmount: 312500, closingDate: '2026-08-27', closingAgent: 'Priya Shah',
    titleCompany: 'Old Republic Title', status: 'Scheduled',
    cdSent: false, wireConfirmed: false, docsReturned: false,
    fundingAmount: 312500, notes: 'Payoff statement pending — 6 open conditions'
  },
  {
    id: 'CLOSE-004', caseId: 'CASE-1029', borrower: 'Liam Johnson',
    loanAmount: 524750, closingDate: '2026-09-04', closingAgent: 'Marcus Webb',
    titleCompany: 'Fidelity National Title', status: 'On Hold',
    cdSent: false, wireConfirmed: false, docsReturned: false,
    fundingAmount: 524750, notes: 'On hold — flood insurance required'
  },
];

@Injectable({ providedIn: 'root' })
export class ClosingService {
  private readonly _closings = signal<ClosingItem[]>(MOCK_CLOSINGS);

  readonly closings = this._closings.asReadonly();

  readonly summary = computed(() => {
    const cl = this._closings();
    return {
      total:         cl.length,
      thisWeek:      cl.filter(c => c.status === 'Scheduled' || c.status === 'Docs Out').length,
      awaitingWire:  cl.filter(c => !c.wireConfirmed && c.status !== 'Funded').length,
      onHold:        cl.filter(c => c.status === 'On Hold').length,
      funded:        cl.filter(c => c.status === 'Funded').length,
    };
  });

  updateStatus(id: string, status: ClosingStatus): void {
    this._closings.update(items => items.map(c => c.id === id ? { ...c, status } : c));
  }

  toggleField(id: string, field: 'cdSent' | 'wireConfirmed' | 'docsReturned'): void {
    this._closings.update(items => items.map(c => c.id === id ? { ...c, [field]: !c[field] } : c));
  }
}
