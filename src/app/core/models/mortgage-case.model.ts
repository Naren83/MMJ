export type CaseStatus = 'New' | 'In Review' | 'Conditional Approval' | 'Clear to Close';
export type CasePriority = 'High' | 'Medium' | 'Low';

export interface MortgageCase {
  id: string;
  borrower: string;
  coBorrower?: string;
  status: CaseStatus;
  priority: CasePriority;
  channel: string;
  loanOfficer: string;
  processor: string;
  underwriter: string;
  loanAmount: number;
  ltv: number;
  rate: number;
  product: string;
  purpose: string;
  propertyAddress: string;
  propertyType: string;
  occupancy: string;
  appraisal: string;
  title: string;
  submitted: string;
  targetClose: string;
  lastUpdated: string;
  slaHoursRemaining: number;
  conditionsOpen: number;
  documentsMissing: number;
  nextAction: string;
  notes: string;
}
