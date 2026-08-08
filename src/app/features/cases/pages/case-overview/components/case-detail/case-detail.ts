import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MortgageCase } from '../../../../../../core/models/mortgage-case.model';

@Component({
  selector: 'app-case-detail',
  imports: [CurrencyPipe, DatePipe, PercentPipe, RouterLink],
  templateUrl: './case-detail.html',
  styleUrl: './case-detail.scss'
})
export class CaseDetail {
  @Input({ required: true }) caseItem!: MortgageCase;
}
