import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';

import { CaseDocument } from '../../models/case-document.model';
import { PROCESS_STEPS } from '../../models/process-step.model';

@Component({
  selector: 'app-document-preview-panel',
  imports: [CommonModule],
  templateUrl: './document-preview-panel.html',
  styleUrl: './document-preview-panel.scss'
})
export class DocumentPreviewPanel {
  @Input({ required: true }) set document(value: CaseDocument) {
    this.documentSignal.set(value);
  }

  @Input() hasPrevious = false;
  @Input() hasNext = false;

  @Output() closed = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  protected readonly zoom = signal(100);
  protected readonly documentSignal = signal<CaseDocument | undefined>(undefined);
  protected readonly processStepLabel = computed(() => {
    const document = this.documentSignal();
    return PROCESS_STEPS.find((step) => step.id === document?.processStep)?.label ?? 'Unclassified';
  });

  protected zoomIn(): void {
    this.zoom.update((value) => Math.min(value + 10, 160));
  }

  protected zoomOut(): void {
    this.zoom.update((value) => Math.max(value - 10, 70));
  }

  protected fitToWidth(): void {
    this.zoom.set(100);
  }
}
