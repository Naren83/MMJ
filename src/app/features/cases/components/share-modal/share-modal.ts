import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

export interface Collaborator {
  name: string;
  email: string;
  role: 'Underwriter' | 'Loan Officer' | 'Processor' | 'Title Agent' | 'Borrower';
  access: 'Full Access' | 'Can Edit Conditions' | 'View Only';
}

const INITIAL_COLLABORATORS: Collaborator[] = [
  { name: 'Jordan Patel', email: 'j.patel@mortgage.com', role: 'Underwriter', access: 'Full Access' },
  { name: 'Maya Chen', email: 'm.chen@mortgage.com', role: 'Loan Officer', access: 'Can Edit Conditions' },
  { name: 'Avery Brooks', email: 'a.brooks@mortgage.com', role: 'Processor', access: 'Full Access' },
  { name: 'Sandra Liu', email: 's.liu@firsttitle.com', role: 'Title Agent', access: 'View Only' },
];

@Component({
  selector: 'app-share-modal',
  standalone: true,
  imports: [],
  templateUrl: './share-modal.html',
  styleUrl: './share-modal.scss'
})
export class ShareModal {
  @Input({ required: true }) caseId!: string;
  @Input({ required: true }) borrower!: string;
  @Output() closed = new EventEmitter<void>();

  protected readonly copied = signal(false);
  protected readonly collaborators = signal<Collaborator[]>(INITIAL_COLLABORATORS);

  protected copyLink(): void {
    const link = `${window.location.origin}/cases/${this.caseId}`;
    navigator.clipboard.writeText(link);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2500);
  }
}
