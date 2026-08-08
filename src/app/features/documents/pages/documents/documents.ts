import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DocumentService } from '../../../../core/services/document.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CaseDocument, DocumentStatus } from '../../../cases/models/case-document.model';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select';

const STATUSES: (DocumentStatus | 'All')[] = ['All', 'Verified', 'Needs Review', 'Uploaded', 'Classified'];

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, CustomSelectComponent],
  templateUrl: './documents.html',
  styleUrl: './documents.scss'
})
export class DocumentsPage {
  protected readonly docSvc    = inject(DocumentService);
  private readonly notifySvc   = inject(NotificationService);

  protected readonly search   = signal('');
  protected readonly status   = signal<DocumentStatus | 'All'>('All');
  protected readonly docType  = signal('All');

  protected readonly statuses = STATUSES;
  protected readonly summary  = this.docSvc.summary;

  protected readonly docTypes = computed(() => ['All', ...this.docSvc.documentTypes]);

  protected readonly filteredDocs = computed(() =>
    this.docSvc.filter(this.search(), this.status(), this.docType())
  );

  protected markVerified(doc: CaseDocument): void {
    this.docSvc.updateStatus(doc.documentId, 'Verified');
    this.notifySvc.showSuccess('Document Verified', `${doc.documentName} (${doc.caseId}) was verified.`);
  }

  protected deleteDoc(doc: CaseDocument): void {
    this.docSvc.remove(doc.documentId);
    this.notifySvc.showInfo('Document Removed', `${doc.documentName} deleted from vault.`);
  }

  protected trackDoc(i: number, d: CaseDocument): string { return d.documentId; }
}
