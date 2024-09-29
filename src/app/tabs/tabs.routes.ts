import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'Menu',
        loadComponent: () => import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'Orders',
        loadComponent: () => import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'News',
        loadComponent: () => import('../tab4/tab4.page').then( m => m.Tab4Page)
      },
      {
        path: 'Profile',
        loadComponent: () => import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: '',
        redirectTo: '/Menu',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/Menu',
    pathMatch: 'full',
  },
];
