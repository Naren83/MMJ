import { MortgageCase } from '../../../core/models/mortgage-case.model';
import { MOCK_MORTGAGE_CASES } from '../../../core/mocks/mock-cases';
import { CaseDocument, DocumentStatus } from '../models/case-document.model';
import { ProcessStepId } from '../models/process-step.model';

interface MockDocumentSeed {
  applicantId?: string;
  applicantName: string;
  documentName: string;
  documentType: string;
  processStep: ProcessStepId;
  status: DocumentStatus;
  fileName: string;
  fileType: string;
  fileSize: string;
  previewAvailable: boolean;
}

const uploaders = ['Avery Brooks', 'Maya Chen', 'Jordan Patel', 'Valuation Desk'];

export function createMockDocumentsForCase(caseItem: MortgageCase): CaseDocument[] {
  const slug = caseItem.borrower.toLowerCase().replaceAll(' ', '-');
  const coSlug = caseItem.coBorrower?.toLowerCase().replaceAll(' ', '-');

  const seeds: MockDocumentSeed[] = [
    {
      applicantId: 'app-primary',
      applicantName: caseItem.borrower,
      documentName: 'Passport',
      documentType: 'ID',
      processStep: 'personal',
      status: 'Verified',
      fileName: `${slug}-passport.pdf`,
      fileType: 'PDF',
      fileSize: '1.8 MB',
      previewAvailable: true
    },
    {
      applicantId: 'app-primary',
      applicantName: caseItem.borrower,
      documentName: 'Utility Bill',
      documentType: 'Address Proof',
      processStep: 'personal',
      status: 'Needs Review',
      fileName: `${slug}-utility-bill.pdf`,
      fileType: 'PDF',
      fileSize: '824 KB',
      previewAvailable: true
    },
    {
      applicantId: 'app-primary',
      applicantName: caseItem.borrower,
      documentName: 'Credit Bureau Report',
      documentType: 'Credit Report',
      processStep: 'liabilities',
      status: 'Classified',
      fileName: `${slug}-credit-report.pdf`,
      fileType: 'PDF',
      fileSize: '2.4 MB',
      previewAvailable: true
    },
    {
      applicantName: 'Case Level',
      documentName: 'Application Form',
      documentType: 'Application',
      processStep: 'summary',
      status: 'Uploaded',
      fileName: `${caseItem.id.toLowerCase()}-application.pdf`,
      fileType: 'PDF',
      fileSize: '1.2 MB',
      previewAvailable: true
    },
    {
      applicantName: 'Case Level',
      documentName: 'Property Valuation Report',
      documentType: 'Valuation',
      processStep: 'collateral',
      status: caseItem.appraisal === 'Received' ? 'Verified' : 'Uploaded',
      fileName: `${caseItem.id.toLowerCase()}-valuation.pdf`,
      fileType: 'PDF',
      fileSize: '4.9 MB',
      previewAvailable: true
    },
    {
      applicantName: 'Case Level',
      documentName: 'Approval Conditions',
      documentType: 'Conditions',
      processStep: 'decision',
      status: caseItem.conditionsOpen > 0 ? 'Uploaded' : 'Verified',
      fileName: `${caseItem.id.toLowerCase()}-approval-conditions.docx`,
      fileType: 'DOCX',
      fileSize: '312 KB',
      previewAvailable: false
    }
  ];

  if (caseItem.coBorrower && coSlug) {
    seeds.splice(3, 0, {
      applicantId: 'app-co',
      applicantName: caseItem.coBorrower,
      documentName: 'Payslip',
      documentType: 'Income Proof',
      processStep: 'personal',
      status: 'Uploaded',
      fileName: `${coSlug}-payslip.pdf`,
      fileType: 'PDF',
      fileSize: '642 KB',
      previewAvailable: true
    });
  }

  return seeds.map((seed, index) => ({
    documentId: `${caseItem.id}-DOC-${String(index + 1).padStart(2, '0')}`,
    caseId: caseItem.id,
    uploadedBy: uploaders[index % uploaders.length],
    uploadedAt: `2026-08-${String(Math.max(1, 8 - index)).padStart(2, '0')}T${String(9 + index).padStart(2, '0')}:15:00`,
    ...seed
  }));
}

export const MOCK_CASE_DOCUMENTS: CaseDocument[] = MOCK_MORTGAGE_CASES.flatMap((caseItem) =>
  createMockDocumentsForCase(caseItem)
);
