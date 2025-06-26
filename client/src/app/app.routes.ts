import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { CatFactsComponent } from './features/cat-facts/cat-facts.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'cats', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cats', component: CatFactsComponent, canActivate: [authGuard] },
];
