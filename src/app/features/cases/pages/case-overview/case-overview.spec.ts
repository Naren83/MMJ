import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CaseOverview } from './case-overview';

describe('CaseOverview', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseOverview],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should render the case overview', async () => {
    const fixture = TestBed.createComponent(CaseOverview);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Case Overview');
    expect(compiled.textContent).toContain('CASE-1042');
    expect(compiled.textContent).toContain('Emma Rodriguez');
  });
});
