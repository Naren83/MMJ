import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClosingService } from '../../../../core/services/closing.service';
import { ClosingItem, ClosingStatus } from '../../../../core/models/closing.model';

@Component({
  selector: 'app-closing-desk',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './closing-desk.html',
  styleUrl: './closing-desk.scss'
})
export class ClosingDesk {
  protected readonly closingSvc = inject(ClosingService);
  protected readonly closings   = this.closingSvc.closings;
  protected readonly summary    = this.closingSvc.summary;

  protected updateStatus(item: ClosingItem, status: ClosingStatus): void {
    this.closingSvc.updateStatus(item.id, status);
  }

  protected toggle(item: ClosingItem, field: 'cdSent' | 'wireConfirmed' | 'docsReturned'): void {
    this.closingSvc.toggleField(item.id, field);
  }

  protected readonly statusOrder: ClosingStatus[] = ['Scheduled', 'Docs Out', 'Docs Back', 'Funded', 'On Hold'];
  protected trackItem(i: number, c: ClosingItem): string { return c.id; }
}
