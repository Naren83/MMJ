import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CaseService } from '../../../../core/services/case.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MortgageCase, CasePriority, CaseStatus } from '../../../../core/models/mortgage-case.model';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select';

@Component({
  selector: 'app-create-case-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CustomSelectComponent],
  templateUrl: './create-case-modal.html',
  styleUrl: './create-case-modal.scss'
})
export class CreateCaseModal {
  private readonly fb = inject(FormBuilder);
  private readonly caseSvc = inject(CaseService);
  private readonly notifySvc = inject(NotificationService);

  @Output() closed = new EventEmitter<void>();
  @Output() caseCreated = new EventEmitter<MortgageCase>();

  protected readonly currentStep = signal<1 | 2 | 3>(1);

  // Dropdown options
  protected readonly channels = ['Retail', 'Wholesale', 'Broker', 'Direct Digital'];
  protected readonly loanOfficers = ['Maya Chen', 'Jordan Patel', 'Sandra Liu', 'Avery Brooks'];
  protected readonly products = ['30Y Fixed Conventional', '15Y Fixed Conventional', '7/6 ARM Jumbo', 'FHA 30Y Fixed'];
  protected readonly purposes = ['Purchase', 'Refinance', 'Cash-Out Refinance'];
  protected readonly priorities: CasePriority[] = ['High', 'Medium', 'Low'];
  protected readonly propertyTypes = ['Single family', 'Condominium', 'Multi-family', 'Townhouse'];
  protected readonly occupancies = ['Primary residence', 'Second home', 'Investment property'];
  protected readonly processors = ['Avery Brooks', 'Nolan Reed', 'Sofia Moreno', 'Riley Morgan'];
  protected readonly underwriters = ['Jordan Patel', 'Maya Chen', 'Alex Rivera'];

  protected readonly form: FormGroup = this.fb.group({
    // Step 1
    borrower: ['', [Validators.required, Validators.minLength(2)]],
    coBorrower: [''],
    channel: ['Retail', Validators.required],
    loanOfficer: ['Maya Chen', Validators.required],

    // Step 2
    loanAmount: [450000, [Validators.required, Validators.min(10000)]],
    ltv: [80, [Validators.required, Validators.min(1), Validators.max(100)]],
    rate: [6.125, [Validators.required, Validators.min(1)]],
    product: ['30Y Fixed Conventional', Validators.required],
    purpose: ['Purchase', Validators.required],
    priority: ['Medium', Validators.required],

    // Step 3
    propertyAddress: ['', Validators.required],
    propertyType: ['Single family', Validators.required],
    occupancy: ['Primary residence', Validators.required],
    processor: ['Avery Brooks', Validators.required],
    underwriter: ['Jordan Patel', Validators.required],
    notes: ['']
  });

  protected nextStep(): void {
    if (this.currentStep() === 1) {
      if (this.form.get('borrower')?.invalid) {
        this.form.get('borrower')?.markAsTouched();
        return;
      }
      this.currentStep.set(2);
    } else if (this.currentStep() === 2) {
      if (this.form.get('loanAmount')?.invalid || this.form.get('ltv')?.invalid) {
        return;
      }
      this.currentStep.set(3);
    }
  }

  protected prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => (s - 1) as 1 | 2 | 3);
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const newId = `CASE-${Math.floor(1000 + Math.random() * 9000)}`;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 21);

    const newCase: MortgageCase = {
      id: newId,
      borrower: val.borrower,
      coBorrower: val.coBorrower || undefined,
      status: 'New',
      priority: val.priority,
      channel: val.channel,
      loanOfficer: val.loanOfficer,
      processor: val.processor,
      underwriter: val.underwriter,
      loanAmount: Number(val.loanAmount),
      ltv: Number(val.ltv) / 100,
      rate: Number(val.rate),
      product: val.product,
      purpose: val.purpose,
      propertyAddress: val.propertyAddress,
      propertyType: val.propertyType,
      occupancy: val.occupancy,
      appraisal: 'Scheduled',
      title: 'Pending',
      submitted: new Date().toISOString(),
      targetClose: targetDate.toISOString().split('T')[0],
      lastUpdated: new Date().toISOString(),
      slaHoursRemaining: 48,
      conditionsOpen: 2,
      documentsMissing: 1,
      nextAction: 'Review initial disclosure packet and assign processor.',
      notes: val.notes || 'New case created via Mid Office Command Center.'
    };

    this.caseSvc.addCase(newCase);
    this.notifySvc.showSuccess('Case Created!', `${newCase.id} for ${newCase.borrower} has been added to the pipeline.`);
    this.caseCreated.emit(newCase);
    this.closed.emit();
  }

  protected updateSelect(controlName: string, value: string): void {
    this.form.get(controlName)?.setValue(value);
  }
}
