import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loggedIn: WritableSignal<boolean> = signal(false);
  private readonly currentUser: WritableSignal<string | null> = signal(null);
  public readonly isAuthenticated = this.loggedIn.asReadonly();
  public readonly user = this.currentUser.asReadonly();

  public login(username: string): void {
    this.currentUser.set(username);
    this.loggedIn.set(true);
  }

  public logout(): void {
    this.currentUser.set(null);
    this.loggedIn.set(false);
  }
}
