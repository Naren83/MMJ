import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CaseNote {
  id: string;
  author: string;
  role: string;
  category: 'Underwriting' | 'Risk Flag' | 'Borrower' | 'Condition';
  text: string;
  createdAt: string;
}

const INITIAL_NOTES: CaseNote[] = [
  {
    id: 'note-1',
    author: 'Jordan Patel',
    role: 'Underwriter',
    category: 'Risk Flag',
    text: 'Review updated bank statements and clear income condition before final sign-off.',
    createdAt: '2026-08-09T09:30:00Z'
  },
  {
    id: 'note-2',
    author: 'Avery Brooks',
    role: 'Processor',
    category: 'Condition',
    text: 'Borrower uploaded 2025 W-2s. Verified with IRS transcript match.',
    createdAt: '2026-08-08T14:15:00Z'
  },
  {
    id: 'note-3',
    author: 'Maya Chen',
    role: 'Loan Officer',
    category: 'Borrower',
    text: 'Borrower confirmed closing date preference for Aug 21 morning.',
    createdAt: '2026-08-07T11:45:00Z'
  }
];

@Component({
  selector: 'app-notes-panel',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './notes-panel.html',
  styleUrl: './notes-panel.scss'
})
export class NotesPanel {
  @Input({ required: true }) caseId!: string;
  @Output() closed = new EventEmitter<void>();

  protected readonly notes = signal<CaseNote[]>(INITIAL_NOTES);
  protected newNoteText = '';
  protected selectedCategory: CaseNote['category'] = 'Underwriting';

  protected addNote(): void {
    if (!this.newNoteText.trim()) return;

    const note: CaseNote = {
      id: `note-${Date.now()}`,
      author: 'Jordan Patel',
      role: 'Underwriter',
      category: this.selectedCategory,
      text: this.newNoteText.trim(),
      createdAt: new Date().toISOString()
    };

    this.notes.update((list) => [note, ...list]);
    this.newNoteText = '';
  }

  protected deleteNote(id: string): void {
    this.notes.update((list) => list.filter((n) => n.id !== id));
  }
}
