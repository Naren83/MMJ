import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface CaseSummary {
  totalLoanAmount: number;
  urgentCases: number;
  openConditions: number;
  closingSoon: number;
}

@Component({
  selector: 'app-case-summary-metrics',
  imports: [CurrencyPipe],
  templateUrl: './case-summary-metrics.html',
  styleUrl: './case-summary-metrics.scss'
})
export class CaseSummaryMetrics {
  @Input({ required: true }) summary!: CaseSummary;
}
