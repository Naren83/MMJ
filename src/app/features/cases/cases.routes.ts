import { Routes } from '@angular/router';

export const CASE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../shared/components/shell-layout/shell-layout').then(m => m.ShellLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/case-overview/case-overview').then(m => m.CaseOverview)
      },
      {
        path: 'pipeline',
        loadComponent: () =>
          import('../pipeline/pages/pipeline/pipeline').then(m => m.Pipeline)
      },
      {
        path: 'conditions',
        loadComponent: () =>
          import('../conditions/pages/conditions/conditions').then(m => m.Conditions)
      },
      {
        path: 'closing-desk',
        loadComponent: () =>
          import('../closing/pages/closing-desk/closing-desk').then(m => m.ClosingDesk)
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('../documents/pages/documents/documents').then(m => m.DocumentsPage)
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('../reports/pages/reports/reports').then(m => m.ReportsPage)
      }
    ]
  },
  {
    path: 'cases/:caseId',
    loadComponent: () =>
      import('./pages/case-workspace/case-workspace').then(m => m.CaseWorkspace)
  }
];
