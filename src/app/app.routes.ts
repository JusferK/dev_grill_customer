import { Routes } from '@angular/router';
import { sessionSafeGuard } from './auth/session-safe.guard';
import { loginSafeGuard } from './auth/login-safe.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [sessionSafeGuard],
    canActivateChild: [sessionSafeGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage),
    canActivate: [loginSafeGuard]
  },
  {
    path: 'sign',
    loadComponent: () => import('./sign/sign.page').then( m => m.SignPage),
    canActivate: [loginSafeGuard]
  },
];
