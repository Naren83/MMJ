import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  computed,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string;
  badge?: string;
  icon?: string;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './custom-select.html',
  styleUrl: './custom-select.scss'
})
export class CustomSelectComponent {
  @Input() set options(val: (string | SelectOption)[]) {
    this.parsedOptions.set(
      val.map((item) =>
        typeof item === 'string' ? { label: item, value: item } : item
      )
    );
  }
  @Input() value: string = '';
  @Input() placeholder: string = 'Select option…';
  @Input() label?: string;
  @Input() disabled: boolean = false;

  @Output() valueChange = new EventEmitter<string>();

  protected readonly isOpen = signal(false);
  protected readonly searchFilter = signal('');
  protected readonly parsedOptions = signal<SelectOption[]>([]);

  constructor(private readonly el: ElementRef) {}

  protected readonly filteredOptions = computed(() => {
    const q = this.searchFilter().toLowerCase().trim();
    if (!q) return this.parsedOptions();
    return this.parsedOptions().filter((o) =>
      o.label.toLowerCase().includes(q)
    );
  });

  protected readonly selectedOption = computed(() => {
    return this.parsedOptions().find((o) => o.value === this.value);
  });

  protected toggle(): void {
    if (this.disabled) return;
    this.isOpen.update((v) => !v);
    if (!this.isOpen()) {
      this.searchFilter.set('');
    }
  }

  protected select(val: string): void {
    this.value = val;
    this.valueChange.emit(val);
    this.isOpen.set(false);
    this.searchFilter.set('');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.searchFilter.set('');
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    this.isOpen.set(false);
    this.searchFilter.set('');
  }
}
