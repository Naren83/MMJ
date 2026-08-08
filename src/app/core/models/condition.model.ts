export type ConditionStatus = 'Open' | 'Received' | 'Waived' | 'Cleared';
export type ConditionCategory = 'Income' | 'Asset' | 'Credit' | 'Property' | 'Title' | 'Insurance' | 'Compliance';

export interface ConditionItem {
  id: string;
  caseId: string;
  borrower: string;
  category: ConditionCategory;
  description: string;
  status: ConditionStatus;
  assignedTo: string;
  dueDate: string;
  receivedDate?: string;
  notes?: string;
  priority: 'High' | 'Medium' | 'Low';
}
