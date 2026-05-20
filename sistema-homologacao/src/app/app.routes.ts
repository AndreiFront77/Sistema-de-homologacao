import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { CardDetailComponent } from './pages/card-detail/card-detail.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BugsGeralComponent } from './pages/bugs-geral/bugs-geral.component';
import { SmartDashboardsComponent } from './pages/smart-dashboards/smart-dashboards-final.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'landing', redirectTo: '', pathMatch: 'full' },
  { path: 'cards/:cardId', component: CardDetailComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'bugs-geral', component: BugsGeralComponent },
  { path: 'smart-dashboards', component: SmartDashboardsComponent }
];
