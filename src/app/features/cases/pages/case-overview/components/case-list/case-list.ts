import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CaseStatus, MortgageCase } from '../../../../../../core/models/mortgage-case.model';

@Component({
  selector: 'app-case-list',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './case-list.html',
  styleUrl: './case-list.scss'
})
export class CaseList {
  @Input({ required: true }) cases: MortgageCase[] = [];
  @Input({ required: true }) selectedCaseId = '';

  @Output() caseSelected = new EventEmitter<string>();

  protected selectCase(caseId: string): void {
    this.caseSelected.emit(caseId);
  }

  protected statusKey(status: CaseStatus): string {
    return status.toLowerCase().replaceAll(' ', '-');
  }
}
