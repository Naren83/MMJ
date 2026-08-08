import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MOCK_MORTGAGE_CASES } from '../../../../core/mocks/mock-cases';
import { DocumentPanel } from '../../components/document-panel/document-panel';
import { DocumentPreviewPanel } from '../../components/document-preview-panel/document-preview-panel';
import { ProcessFlow } from '../../components/process-flow/process-flow';
import { ProcessStepContent } from '../../components/process-step-content/process-step-content';
import { NotesPanel } from '../../components/notes-panel/notes-panel';
import { HistoryPanel } from '../../components/history-panel/history-panel';
import { ShareModal } from '../../components/share-modal/share-modal';
import { MOCK_CASE_DOCUMENTS } from '../../mocks/mock-documents';
import { CaseApplicant, CaseDocument } from '../../models/case-document.model';
import {
  PROCESS_STEP_ORDER,
  PROCESS_STEPS,
  ProcessStep,
  ProcessStepId,
  ProcessStepState
} from '../../models/process-step.model';

@Component({
  selector: 'app-case-workspace',
  standalone: true,
  imports: [
    CurrencyPipe, DatePipe, PercentPipe,
    DocumentPanel, DocumentPreviewPanel, ProcessFlow, ProcessStepContent,
    NotesPanel, HistoryPanel, ShareModal,
    RouterLink
  ],
  templateUrl: './case-workspace.html',
  styleUrl: './case-workspace.scss'
})
export class CaseWorkspace {
  private readonly route = inject(ActivatedRoute);
  private readonly caseId = this.route.snapshot.paramMap.get('caseId');

  protected readonly activeStepId = signal<ProcessStepId>('summary');

  // Tool Drawer Signals
  protected readonly documentPanelOpen = signal(false);
  protected readonly notesPanelOpen    = signal(false);
  protected readonly historyPanelOpen  = signal(false);
  protected readonly shareModalOpen    = signal(false);

  protected readonly previewDocumentId = signal<string | undefined>(undefined);

  protected readonly caseItem =
    MOCK_MORTGAGE_CASES.find((caseItem) => caseItem.id === this.caseId) ?? MOCK_MORTGAGE_CASES[0];

  protected readonly documents = signal<CaseDocument[]>(
    MOCK_CASE_DOCUMENTS.filter((document) => document.caseId === this.caseItem.id)
  );

  protected readonly applicants = computed<CaseApplicant[]>(() => {
    const caseApplicants: CaseApplicant[] = [
      {
        applicantId: 'app-primary',
        applicantName: this.caseItem.borrower,
        role: 'Primary Applicant'
      }
    ];

    if (this.caseItem.coBorrower) {
      caseApplicants.push({
        applicantId: 'app-co',
        applicantName: this.caseItem.coBorrower,
        role: 'Co-Applicant'
      });
    }

    caseApplicants.push({
      applicantId: 'case',
      applicantName: 'Case Level',
      role: 'Case Level'
    });

    return caseApplicants;
  });

  protected readonly steps = computed<ProcessStep[]>(() =>
    PROCESS_STEPS.map((step) => ({
      ...step,
      status: this.stepStatus(step.id)
    }))
  );

  protected readonly activeStep = computed(() => {
    return this.steps().find((step) => step.id === this.activeStepId()) ?? this.steps()[0];
  });

  protected readonly previewDocument = computed(() =>
    this.documents().find((document) => document.documentId === this.previewDocumentId())
  );

  protected readonly previewDocumentIndex = computed(() =>
    this.documents().findIndex((document) => document.documentId === this.previewDocumentId())
  );

  // Tool Panel Toggles (mutually exclusive sidebar drawers)
  protected toggleDocumentPanel(): void {
    const nextState = !this.documentPanelOpen();
    this.closeAllPanels();
    this.documentPanelOpen.set(nextState);
  }

  protected toggleNotesPanel(): void {
    const nextState = !this.notesPanelOpen();
    this.closeAllPanels();
    this.notesPanelOpen.set(nextState);
  }

  protected toggleHistoryPanel(): void {
    const nextState = !this.historyPanelOpen();
    this.closeAllPanels();
    this.historyPanelOpen.set(nextState);
  }

  protected openShareModal(): void {
    this.shareModalOpen.set(true);
  }

  protected closeShareModal(): void {
    this.shareModalOpen.set(false);
  }

  private closeAllPanels(): void {
    this.documentPanelOpen.set(false);
    this.notesPanelOpen.set(false);
    this.historyPanelOpen.set(false);
  }

  protected selectStep(stepId: ProcessStepId): void {
    this.activeStepId.set(stepId);
  }

  protected addDocument(document: CaseDocument): void {
    this.documents.update((documents) => [
      {
        ...document,
        caseId: this.caseItem.id
      },
      ...documents
    ]);
  }

  protected deleteDocument(documentId: string): void {
    this.documents.update((documents) => documents.filter((document) => document.documentId !== documentId));

    if (this.previewDocumentId() === documentId) {
      this.previewDocumentId.set(undefined);
    }
  }

  protected previewDocumentFromPanel(document: CaseDocument): void {
    this.previewDocumentId.set(document.documentId);
  }

  protected previewPreviousDocument(): void {
    const index = this.previewDocumentIndex();

    if (index > 0) {
      this.previewDocumentId.set(this.documents()[index - 1].documentId);
    }
  }

  protected previewNextDocument(): void {
    const index = this.previewDocumentIndex();
    const documents = this.documents();

    if (index >= 0 && index < documents.length - 1) {
      this.previewDocumentId.set(documents[index + 1].documentId);
    }
  }

  private stepStatus(stepId: ProcessStepId): ProcessStepState {
    const activeIndex = PROCESS_STEP_ORDER.indexOf(this.activeStepId());
    const stepIndex = PROCESS_STEP_ORDER.indexOf(stepId);

    if (stepIndex < activeIndex) {
      return 'complete';
    }

    return stepIndex === activeIndex ? 'active' : 'pending';
  }
}
