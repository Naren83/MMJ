import { ProcessStepId } from './process-step.model';

export type DocumentStatus = 'Uploaded' | 'Classified' | 'Needs Review' | 'Missing' | 'Rejected' | 'Verified';

export interface CaseApplicant {
  applicantId: string;
  applicantName: string;
  role: 'Primary Applicant' | 'Co-Applicant' | 'Case Level';
}

export interface CaseDocument {
  documentId: string;
  caseId: string;
  applicantId?: string;
  applicantName: string;
  documentName: string;
  documentType: string;
  processStep: ProcessStepId;
  status: DocumentStatus;
  uploadedBy: string;
  uploadedAt: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  previewAvailable: boolean;
}

