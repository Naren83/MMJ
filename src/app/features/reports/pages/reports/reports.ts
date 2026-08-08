import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { CaseService } from '../../../../core/services/case.service';

export interface ProcessorMetric {
  name: string;
  casesHandled: number;
  conditionsCleared: number;
  avgSlaHours: number;
  fundedVolume: number;
}

const PROCESSOR_LEADERBOARD: ProcessorMetric[] = [
  { name: 'Avery Brooks', casesHandled: 12, conditionsCleared: 34, avgSlaHours: 14, fundedVolume: 3250000 },
  { name: 'Nolan Reed',    casesHandled: 9,  conditionsCleared: 28, avgSlaHours: 18, fundedVolume: 2480000 },
  { name: 'Sofia Moreno',  casesHandled: 8,  conditionsCleared: 21, avgSlaHours: 21, fundedVolume: 1950000 },
  { name: 'Riley Morgan',  casesHandled: 6,  conditionsCleared: 15, avgSlaHours: 24, fundedVolume: 1420000 },
];

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CurrencyPipe, PercentPipe],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class ReportsPage {
  private readonly caseSvc = inject(CaseService);

  protected readonly timeRange = signal<'7d' | '30d' | '90d' | 'ytd'>('30d');
  protected readonly summary   = this.caseSvc.summary;
  protected readonly cases     = this.caseSvc.cases;

  protected readonly leaderboard = PROCESSOR_LEADERBOARD;

  protected readonly fundedVolumeTotal = computed(() =>
    this.leaderboard.reduce((sum, p) => sum + p.fundedVolume, 0)
  );

  protected readonly avgCycleDays = 18.4;
  protected readonly underwritingPassRate = 0.942;
  protected readonly firstTimeClearRate = 0.885;
}
