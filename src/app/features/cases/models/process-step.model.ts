export type ProcessStepId = 'summary' | 'personal' | 'liabilities' | 'collateral' | 'decision';
export type ProcessStepState = 'complete' | 'active' | 'pending';

export interface ProcessStep {
  id: ProcessStepId;
  label: string;
  shortLabel: string;
  status: ProcessStepState;
  owner: string;
}

export const PROCESS_STEP_ORDER: ProcessStepId[] = ['summary', 'personal', 'liabilities', 'collateral', 'decision'];

export const PROCESS_STEPS: Omit<ProcessStep, 'status'>[] = [
  { id: 'summary', label: 'Summary', shortLabel: 'SUM', owner: 'Mid Office' },
  { id: 'personal', label: 'Personal Details', shortLabel: 'PER', owner: 'KYC Review' },
  { id: 'liabilities', label: 'External Liabilities', shortLabel: 'DTI', owner: 'Credit Review' },
  { id: 'collateral', label: 'Collateral', shortLabel: 'COL', owner: 'Valuation' },
  { id: 'decision', label: 'Decision', shortLabel: 'DEC', owner: 'Reviewer' }
];
