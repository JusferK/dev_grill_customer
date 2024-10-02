import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'menu',
        loadComponent: () => import('../menu/tab1.page').then((m) => m.Tab1Page)
      },
      {
        path: 'orders',
        loadComponent: () => import('../orders/tab2.page').then((m) => m.Tab2Page)
      },
      {
        path: 'news',
        loadComponent: () => import('../news/tab4.page').then( m => m.Tab4Page)
      },
      {
        path: 'profile',
        loadComponent: () => import('../profile/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: '',
        redirectTo: '/menu',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/menu',
    pathMatch: 'full',
  },
];
