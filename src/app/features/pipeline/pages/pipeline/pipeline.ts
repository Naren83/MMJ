import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CaseService } from '../../../../core/services/case.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MortgageCase, CaseStatus } from '../../../../core/models/mortgage-case.model';

const STAGE_ORDER: CaseStatus[] = ['New', 'In Review', 'Conditional Approval', 'Clear to Close'];

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './pipeline.html',
  styleUrl: './pipeline.scss'
})
export class Pipeline {
  protected readonly caseSvc   = inject(CaseService);
  private readonly notifySvc   = inject(NotificationService);

  protected readonly stages        = this.caseSvc.pipelineStages;
  protected readonly summary       = this.caseSvc.summary;
  protected readonly draggingId    = signal<string | null>(null);
  protected readonly dragOverStage = signal<CaseStatus | null>(null);

  /** Compute total volume per stage */
  protected getStageVolume(cases: MortgageCase[]): number {
    return cases.reduce((acc, c) => acc + c.loanAmount, 0);
  }

  /** Drag & Drop Handlers */
  protected dragStart(caseId: string, event: DragEvent): void {
    this.draggingId.set(caseId);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', caseId);
    }
  }

  protected dragOver(stageStatus: CaseStatus, event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    if (this.dragOverStage() !== stageStatus) {
      this.dragOverStage.set(stageStatus);
    }
  }

  protected dragLeave(stageStatus: CaseStatus): void {
    if (this.dragOverStage() === stageStatus) {
      this.dragOverStage.set(null);
    }
  }

  protected drop(targetStatus: CaseStatus, event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const caseId = event.dataTransfer?.getData('text/plain') || this.draggingId();

    if (caseId) {
      const caseItem = this.caseSvc.getById(caseId);
      this.caseSvc.updateStatus(caseId, targetStatus);
      if (caseItem) {
        this.notifySvc.showSuccess('Stage Updated', `${caseItem.id} (${caseItem.borrower}) moved to ${targetStatus}.`);
      }
    }

    this.draggingId.set(null);
    this.dragOverStage.set(null);
  }

  protected dragEnd(): void {
    setTimeout(() => {
      this.draggingId.set(null);
      this.dragOverStage.set(null);
    }, 50);
  }

  /** Quick move to next / previous stage with 1-click */
  protected moveStage(caseId: string, currentStatus: CaseStatus, direction: 'next' | 'prev', event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    const idx = STAGE_ORDER.indexOf(currentStatus);
    let newStatus: CaseStatus | null = null;

    if (direction === 'next' && idx < STAGE_ORDER.length - 1) {
      newStatus = STAGE_ORDER[idx + 1];
    } else if (direction === 'prev' && idx > 0) {
      newStatus = STAGE_ORDER[idx - 1];
    }

    if (newStatus) {
      const caseItem = this.caseSvc.getById(caseId);
      this.caseSvc.updateStatus(caseId, newStatus);
      if (caseItem) {
        this.notifySvc.showSuccess('Stage Advanced', `${caseItem.id} moved to ${newStatus}.`);
      }
    }
  }

  protected isFirstStage(status: CaseStatus): boolean {
    return STAGE_ORDER.indexOf(status) === 0;
  }

  protected isLastStage(status: CaseStatus): boolean {
    return STAGE_ORDER.indexOf(status) === STAGE_ORDER.length - 1;
  }

  protected trackCase(i: number, c: MortgageCase): string { return c.id; }
}
