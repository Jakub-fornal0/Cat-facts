import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = signal(false);
  private currentUser = signal<string | null>(null);
  isAuthenticated = this.loggedIn.asReadonly();
  user = this.currentUser.asReadonly();

  public login(username: string): void {
    this.currentUser.set(username);
    this.loggedIn.set(true);
  }

  public logout(): void {
    this.currentUser.set(null);
    this.loggedIn.set(false);
  }
}
