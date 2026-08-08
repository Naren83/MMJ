import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/cases/cases.routes').then((routes) => routes.CASE_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
