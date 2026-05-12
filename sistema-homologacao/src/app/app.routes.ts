import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { CardDetailComponent } from './pages/card-detail/card-detail.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'cards/:cardId',
    component: CardDetailComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];
