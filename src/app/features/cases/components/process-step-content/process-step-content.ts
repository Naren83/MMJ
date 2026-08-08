import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MortgageCase } from '../../../../core/models/mortgage-case.model';
import { ProcessStepId } from '../../models/process-step.model';

@Component({
  selector: 'app-process-step-content',
  imports: [CurrencyPipe, DatePipe, PercentPipe],
  templateUrl: './process-step-content.html',
  styleUrl: './process-step-content.scss'
})
export class ProcessStepContent {
  @Input({ required: true }) activeStepId!: ProcessStepId;
  @Input({ required: true }) caseItem!: MortgageCase;
}
