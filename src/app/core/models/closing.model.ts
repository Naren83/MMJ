export type ClosingStatus = 'Scheduled' | 'Docs Out' | 'Docs Back' | 'Funded' | 'On Hold';

export interface ClosingItem {
  id: string;
  caseId: string;
  borrower: string;
  loanAmount: number;
  closingDate: string;
  closingAgent: string;
  titleCompany: string;
  status: ClosingStatus;
  cdSent: boolean;
  wireConfirmed: boolean;
  docsReturned: boolean;
  fundingAmount: number;
  notes: string;
}
