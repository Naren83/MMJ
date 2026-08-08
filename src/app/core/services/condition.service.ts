import { Injectable, signal, computed } from '@angular/core';
import { MOCK_MORTGAGE_CASES } from '../mocks/mock-cases';
import { ConditionItem, ConditionStatus, ConditionCategory } from '../models/condition.model';

const MOCK_CONDITIONS: ConditionItem[] = [
  { id: 'COND-001', caseId: 'CASE-1042', borrower: 'Emma Rodriguez',    category: 'Income',     description: 'Upload last 2 months bank statements',               status: 'Open',     assignedTo: 'Avery Brooks',  dueDate: '2026-08-12', priority: 'High'   },
  { id: 'COND-002', caseId: 'CASE-1042', borrower: 'Emma Rodriguez',    category: 'Income',     description: 'Clear income condition — payslip resubmission',       status: 'Received', assignedTo: 'Jordan Patel',  dueDate: '2026-08-10', priority: 'High',  receivedDate: '2026-08-09' },
  { id: 'COND-003', caseId: 'CASE-1038', borrower: 'Noah Williams',     category: 'Credit',     description: 'Explain credit inquiry on 2026-06-14',                status: 'Open',     assignedTo: 'Sofia Moreno',  dueDate: '2026-08-14', priority: 'Medium' },
  { id: 'COND-004', caseId: 'CASE-1038', borrower: 'Noah Williams',     category: 'Asset',      description: 'Provide 60-day history for down-payment account',    status: 'Open',     assignedTo: 'Nolan Reed',    dueDate: '2026-08-13', priority: 'Medium' },
  { id: 'COND-005', caseId: 'CASE-1038', borrower: 'Noah Williams',     category: 'Income',     description: 'Payoff statement for auto loan',                      status: 'Open',     assignedTo: 'Sofia Moreno',  dueDate: '2026-08-11', priority: 'High'   },
  { id: 'COND-006', caseId: 'CASE-1038', borrower: 'Noah Williams',     category: 'Compliance', description: 'Updated homeowners insurance binder',                 status: 'Open',     assignedTo: 'Nolan Reed',    dueDate: '2026-08-11', priority: 'High'   },
  { id: 'COND-007', caseId: 'CASE-1054', borrower: 'Sophia Kim',        category: 'Property',   description: 'Clear certificate of occupancy from city',           status: 'Waived',   assignedTo: 'Riley Morgan',  dueDate: '2026-08-09', priority: 'Low'    },
  { id: 'COND-008', caseId: 'CASE-1054', borrower: 'Sophia Kim',        category: 'Title',      description: 'Clear title — resolve open lien from 2024',          status: 'Cleared',  assignedTo: 'Jordan Patel',  dueDate: '2026-08-08', priority: 'High',  receivedDate: '2026-08-08' },
  { id: 'COND-009', caseId: 'CASE-1029', borrower: 'Liam Johnson',      category: 'Income',     description: 'Upload W-2s for 2024 and 2025',                      status: 'Open',     assignedTo: 'Avery Brooks',  dueDate: '2026-09-01', priority: 'Medium' },
  { id: 'COND-010', caseId: 'CASE-1029', borrower: 'Liam Johnson',      category: 'Asset',      description: 'Gift letter from relative — source of funds',        status: 'Open',     assignedTo: 'Sofia Moreno',  dueDate: '2026-09-03', priority: 'Medium' },
  { id: 'COND-011', caseId: 'CASE-1029', borrower: 'Liam Johnson',      category: 'Insurance',  description: 'Flood insurance required — property in Zone AE',      status: 'Open',     assignedTo: 'Avery Brooks',  dueDate: '2026-09-01', priority: 'High'   },
  { id: 'COND-012', caseId: 'CASE-1029', borrower: 'Liam Johnson',      category: 'Compliance', description: 'IRS 4506-C transcript verification',                  status: 'Received', assignedTo: 'Jordan Patel',  dueDate: '2026-08-28', priority: 'Medium', receivedDate: '2026-08-09' },
];

@Injectable({ providedIn: 'root' })
export class ConditionService {
  private readonly _conditions = signal<ConditionItem[]>(MOCK_CONDITIONS);

  readonly conditions = this._conditions.asReadonly();

  readonly summary = computed(() => {
    const conds = this._conditions();
    return {
      total:    conds.length,
      open:     conds.filter(c => c.status === 'Open').length,
      received: conds.filter(c => c.status === 'Received').length,
      cleared:  conds.filter(c => c.status === 'Cleared' || c.status === 'Waived').length,
      highPriority: conds.filter(c => c.status === 'Open' && c.priority === 'High').length,
    };
  });

  getForCase(caseId: string): ConditionItem[] {
    return this._conditions().filter(c => c.caseId === caseId);
  }

  updateStatus(condId: string, status: ConditionStatus): void {
    this._conditions.update(conds =>
      conds.map(c => c.id === condId ? {
        ...c,
        status,
        receivedDate: (status === 'Received' || status === 'Cleared') ? new Date().toISOString().split('T')[0] : c.receivedDate
      } : c)
    );
  }

  filter(query: string, status: ConditionStatus | 'All', category: ConditionCategory | 'All'): ConditionItem[] {
    return this._conditions().filter(c => {
      const q = query.toLowerCase().trim();
      const matchesQuery    = !q || [c.id, c.borrower, c.description, c.assignedTo].some(v => v.toLowerCase().includes(q));
      const matchesStatus   = status   === 'All' || c.status   === status;
      const matchesCategory = category === 'All' || c.category === category;
      return matchesQuery && matchesStatus && matchesCategory;
    });
  }
}
