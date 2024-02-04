import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    loadComponent: () => import('./views/search/search.component').then(c => c.SearchComponent)
  },
  {
    path: 'bike/:id',
    loadComponent: () => import('./views/bike/bike.component').then(c => c.BikeComponent)
  }
];
