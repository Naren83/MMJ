import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ProcessStep, ProcessStepId } from '../../models/process-step.model';

@Component({
  selector: 'app-process-flow',
  templateUrl: './process-flow.html',
  styleUrl: './process-flow.scss'
})
export class ProcessFlow {
  @Input({ required: true }) steps: ProcessStep[] = [];

  @Output() stepSelected = new EventEmitter<ProcessStepId>();

  protected selectStep(stepId: ProcessStepId): void {
    this.stepSelected.emit(stepId);
  }
}
