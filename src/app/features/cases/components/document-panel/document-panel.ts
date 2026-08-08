import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CaseApplicant, CaseDocument, DocumentStatus } from '../../models/case-document.model';
import { PROCESS_STEPS, ProcessStepId } from '../../models/process-step.model';

interface AddDocumentModel {
  applicantId: string;
  processStep: ProcessStepId;
  documentType: string;
  documentName: string;
  fileName: string;
}

@Component({
  selector: 'app-document-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './document-panel.html',
  styleUrl: './document-panel.scss'
})
export class DocumentPanel {
  @Input({ required: true }) set applicants(value: CaseApplicant[]) {
    this.applicantsSignal.set(value);
  }

  @Input({ required: true }) set documents(value: CaseDocument[]) {
    this.documentsSignal.set(value);
  }

  @Input() selectedDocumentId?: string;

  @Output() documentAdded = new EventEmitter<CaseDocument>();
  @Output() documentDeleted = new EventEmitter<string>();
  @Output() documentPreviewed = new EventEmitter<CaseDocument>();

  protected readonly applicantsSignal = signal<CaseApplicant[]>([]);
  protected readonly documentsSignal = signal<CaseDocument[]>([]);
  protected readonly selectedApplicantId = signal('all');
  protected readonly selectedStepId = signal<ProcessStepId | 'all'>('all');
  protected readonly selectedStatus = signal<DocumentStatus | 'all'>('all');
  protected readonly searchTerm = signal('');
  protected readonly metadataDocumentId = signal<string | undefined>(undefined);
  protected readonly showAddForm = signal(false);

  protected readonly steps = PROCESS_STEPS;
  protected readonly statuses: DocumentStatus[] = ['Uploaded', 'Classified', 'Needs Review', 'Missing', 'Rejected', 'Verified'];
  protected readonly addModel = signal<AddDocumentModel>({
    applicantId: 'case',
    processStep: 'personal' as ProcessStepId,
    documentType: '',
    documentName: '',
    fileName: ''
  });

  protected readonly visibleDocuments = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();

    return this.documentsSignal().filter((document) => {
      const applicantMatch =
        this.selectedApplicantId() === 'all' ||
        (this.selectedApplicantId() === 'case' && !document.applicantId) ||
        document.applicantId === this.selectedApplicantId();
      const stepMatch = this.selectedStepId() === 'all' || document.processStep === this.selectedStepId();
      const statusMatch = this.selectedStatus() === 'all' || document.status === this.selectedStatus();
      const searchMatch =
        !search ||
        document.documentName.toLowerCase().includes(search) ||
        document.documentType.toLowerCase().includes(search);

      return applicantMatch && stepMatch && statusMatch && searchMatch;
    });
  });

  protected readonly groupedDocuments = computed(() =>
    this.steps.map((step) => ({
      step,
      documents: this.visibleDocuments().filter((document) => document.processStep === step.id)
    }))
  );

  protected readonly metadataDocument = computed(() =>
    this.documentsSignal().find((document) => document.documentId === this.metadataDocumentId())
  );

  protected selectApplicant(applicantId: string): void {
    this.selectedApplicantId.set(applicantId);
  }

  protected updateAddField(field: keyof AddDocumentModel, value: string): void {
    this.addModel.update((model) => ({ ...model, [field]: value }));
  }

  protected submitDocument(): void {
    const model = this.addModel();

    if (!model.applicantId || !model.processStep || !model.documentType.trim() || !model.documentName.trim() || !model.fileName.trim()) {
      return;
    }

    const applicant = this.applicantsSignal().find((item) => item.applicantId === model.applicantId);
    const isCaseLevel = model.applicantId === 'case';
    const now = new Date().toISOString();

    this.documentAdded.emit({
      documentId: `DOC-${Date.now()}`,
      caseId: '',
      applicantId: isCaseLevel ? undefined : model.applicantId,
      applicantName: isCaseLevel ? 'Case Level' : applicant?.applicantName ?? 'Applicant',
      documentName: model.documentName.trim(),
      documentType: model.documentType.trim(),
      processStep: model.processStep,
      status: 'Uploaded',
      uploadedBy: 'Mid Office User',
      uploadedAt: now,
      fileName: model.fileName.trim(),
      fileType: model.fileName.split('.').pop()?.toUpperCase() || 'FILE',
      fileSize: 'Mock upload',
      previewAvailable: true
    });

    const selectedStep = this.selectedStepId();
    const selectedApplicant = this.selectedApplicantId();

    this.addModel.set({
      applicantId: selectedApplicant === 'all' ? 'case' : selectedApplicant,
      processStep: selectedStep === 'all' ? 'personal' : selectedStep,
      documentType: '',
      documentName: '',
      fileName: ''
    });
    this.showAddForm.set(false);
  }

  protected confirmDelete(document: CaseDocument): void {
    if (window.confirm(`Delete ${document.documentName}?`)) {
      this.documentDeleted.emit(document.documentId);
    }
  }

  protected stepLabel(stepId: ProcessStepId): string {
    return this.steps.find((step) => step.id === stepId)?.label ?? stepId;
  }
}
