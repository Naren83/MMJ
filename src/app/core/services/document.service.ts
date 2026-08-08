import { Injectable, signal, computed } from '@angular/core';
import { MOCK_CASE_DOCUMENTS } from '../../features/cases/mocks/mock-documents';
import { CaseDocument, DocumentStatus } from '../../features/cases/models/case-document.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly _documents = signal<CaseDocument[]>(MOCK_CASE_DOCUMENTS);

  readonly documents = this._documents.asReadonly();

  readonly summary = computed(() => {
    const docs = this._documents();
    return {
      total:       docs.length,
      verified:    docs.filter(d => d.status === 'Verified').length,
      needsReview: docs.filter(d => d.status === 'Needs Review').length,
      uploaded:    docs.filter(d => d.status === 'Uploaded').length,
    };
  });

  getForCase(caseId: string): CaseDocument[] {
    return this._documents().filter(d => d.caseId === caseId);
  }

  getById(documentId: string): CaseDocument | undefined {
    return this._documents().find(d => d.documentId === documentId);
  }

  filter(query: string, status: DocumentStatus | 'All', docType: string): CaseDocument[] {
    return this._documents().filter(d => {
      const q = query.toLowerCase().trim();
      const matchesQuery = !q || [
        d.documentId, d.caseId, d.applicantName, d.documentName, d.fileName, d.uploadedBy
      ].some(v => v.toLowerCase().includes(q));

      const matchesStatus = status === 'All' || d.status === status;
      const matchesType   = docType === 'All' || d.documentType === docType;

      return matchesQuery && matchesStatus && matchesType;
    });
  }

  get documentTypes(): string[] {
    return [...new Set(this._documents().map(d => d.documentType))].sort();
  }

  add(doc: CaseDocument): void {
    this._documents.update(docs => [doc, ...docs]);
  }

  remove(documentId: string): void {
    this._documents.update(docs => docs.filter(d => d.documentId !== documentId));
  }

  updateStatus(documentId: string, status: DocumentStatus): void {
    this._documents.update(docs =>
      docs.map(d => d.documentId === documentId ? { ...d, status } : d)
    );
  }
}
