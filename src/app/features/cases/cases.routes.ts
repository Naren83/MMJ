import { Routes } from '@angular/router';

export const CASE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/case-overview/case-overview').then((component) => component.CaseOverview)
  },
  {
    path: 'cases/:caseId',
    loadComponent: () =>
      import('./pages/case-workspace/case-workspace').then((component) => component.CaseWorkspace)
  }
];
