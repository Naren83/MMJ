import { Component, EventEmitter, Input, Output, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';

export interface AuditLogItem {
  id: string;
  actor: string;
  role: string;
  action: string;
  detail: string;
  timestamp: string;
  category: 'Status' | 'Document' | 'Condition' | 'System';
}

const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    actor: 'Jordan Patel',
    role: 'Underwriter',
    action: 'Status Updated',
    detail: 'Changed status from In Review to Conditional Approval',
    timestamp: '2026-08-09T09:15:00Z',
    category: 'Status'
  },
  {
    id: 'log-2',
    actor: 'Avery Brooks',
    role: 'Processor',
    action: 'Document Uploaded',
    detail: 'Uploaded 2025 W-2 Tax Transcript (CASE-1042-DOC-04)',
    timestamp: '2026-08-08T16:40:00Z',
    category: 'Document'
  },
  {
    id: 'log-3',
    actor: 'System Auto',
    role: 'Automated Rule',
    action: 'Condition Created',
    detail: 'Auto-generated condition COND-002: Clear income condition',
    timestamp: '2026-08-08T11:20:00Z',
    category: 'Condition'
  },
  {
    id: 'log-4',
    actor: 'Maya Chen',
    role: 'Loan Officer',
    action: 'Case Created',
    detail: 'Submitted 30Y Fixed Conventional application for Emma Rodriguez',
    timestamp: '2026-08-01T08:00:00Z',
    category: 'System'
  }
];

@Component({
  selector: 'app-history-panel',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './history-panel.html',
  styleUrl: './history-panel.scss'
})
export class HistoryPanel {
  @Input({ required: true }) caseId!: string;
  @Output() closed = new EventEmitter<void>();

  protected readonly filter = signal<'All' | 'Status' | 'Document' | 'Condition' | 'System'>('All');
  protected readonly logs = signal<AuditLogItem[]>(MOCK_AUDIT_LOGS);

  protected readonly filteredLogs = computed(() => {
    const f = this.filter();
    if (f === 'All') return this.logs();
    return this.logs().filter(l => l.category === f);
  });
}
